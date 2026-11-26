import { CONFIG } from './config';
import type { AvatarRule, PipelineStats, SiteAdapter } from './types';
import { buildUrl, isMaskedSrc, measureBox, type Box } from './url';

const ATTR_STATE = 'data-ua-state';
const ATTR_ORIGINAL = 'data-ua-original';
const ATTR_TARGET = 'data-ua-target';
const ATTR_TRIES = 'data-ua-tries';
const ATTR_STYLE = 'data-ua-style';
const ATTR_BOX = 'data-ua-box';

const MAX_TRIES = 3;

interface Job {
  img: HTMLImageElement;
  url: string;
}

export interface PipelineHooks {
  /** 头像已替换为 url，originalUrl 是替换前的绝对地址 */
  onSwap?: (img: HTMLImageElement, originalUrl: string) => void;
}

export class AvatarPipeline {
  private readonly adapter: SiteAdapter;
  private readonly hooks: PipelineHooks;

  private readonly inflight = new Map<string, Promise<boolean>>();
  private readonly failed = new Set<string>();
  private readonly candidates = new Set<HTMLImageElement>();
  private waiting = new WeakSet<HTMLImageElement>();

  private queue: Job[] = [];
  private active = 0;
  private stats: PipelineStats = { masked: 0, failed: 0, pending: 0, active: 0 };

  private observer: MutationObserver | null = null;
  private viewport: IntersectionObserver | null = null;
  private frame: number | null = null;
  private enabled = false;
  private generation = 0;

  constructor(adapter: SiteAdapter, hooks: PipelineHooks = {}) {
    this.adapter = adapter;
    this.hooks = hooks;
  }

  start(): void {
    if (this.enabled) return;
    this.enabled = true;
    this.generation += 1;
    this.stats = { masked: 0, failed: 0, pending: 0, active: 0 };
    this.queue = [];
    this.active = 0;
    this.inflight.clear();
    this.failed.clear();
    this.waiting = new WeakSet<HTMLImageElement>();

    document
      .querySelectorAll<HTMLImageElement>(
        `img[${ATTR_STATE}="restored"], img[${ATTR_STATE}="failed"]`,
      )
      .forEach((img) => this.resetElement(img));

    this.observer = new MutationObserver((records) => this.onMutations(records));
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src'],
    });

    this.scan(document);
  }

  stop(): void {
    this.enabled = false;
    this.observer?.disconnect();
    this.observer = null;
    this.viewport?.disconnect();
    this.viewport = null;
    this.resetQueued();
    this.active = 0;
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
    this.candidates.clear();
  }

  /** 恢复原头像与原始 style，并把元素标记为 restored，避免观察器立刻再次替换 */
  restore(): void {
    document
      .querySelectorAll<HTMLImageElement>(`img[${ATTR_STATE}="masked"]`)
      .forEach((img) => {
        const original = img.getAttribute(ATTR_ORIGINAL);
        if (original) img.setAttribute('src', original);
        this.unpinBox(img);
        img.setAttribute(ATTR_STATE, 'restored');
        img.removeAttribute(ATTR_TARGET);
        img.removeAttribute(ATTR_ORIGINAL);
        img.removeAttribute(ATTR_TRIES);
      });

    // 飞行中的请求不会再有结果，必须把这些元素放回可处理状态，否则会永久卡在 pending
    this.resetQueued();
    document
      .querySelectorAll<HTMLImageElement>(`img[${ATTR_STATE}="pending"]`)
      .forEach((img) => this.resetElement(img));

    this.stats.masked = 0;
    this.stats.failed = 0;
  }

  private resetQueued(): void {
    for (const job of this.queue) this.resetElement(job.img);
    this.queue = [];
  }

  private resetElement(img: HTMLImageElement): void {
    this.unpinBox(img);
    img.removeAttribute(ATTR_STATE);
    img.removeAttribute(ATTR_TARGET);
    img.removeAttribute(ATTR_ORIGINAL);
    img.removeAttribute(ATTR_TRIES);
    img.removeAttribute(ATTR_BOX);
  }

  restart(): void {
    this.stop();
    this.restore();
    this.start();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getStats(): PipelineStats {
    return {
      ...this.stats,
      pending: this.queue.length,
      active: this.active,
    };
  }

  /** 按规则优先级找出元素属于哪条规则 */
  private ruleFor(img: HTMLImageElement): AvatarRule | null {
    for (const rule of this.adapter.rules) {
      if (rule.selectors.some((selector) => img.matches(selector))) return rule;
    }
    return null;
  }

  private scan(root: ParentNode): void {
    for (const rule of this.adapter.rules) {
      root
        .querySelectorAll<HTMLImageElement>(rule.selectors.join(','))
        .forEach((img) => {
          // 已经被更靠前的规则接管
          if (img.hasAttribute(ATTR_TARGET)) return;
          this.consider(img, rule);
        });
    }
  }

  private consider(img: HTMLImageElement, rule: AvatarRule): void {
    if (!this.enabled || !img.isConnected) return;

    const state = img.getAttribute(ATTR_STATE);

    if (state === 'masked') {
      // 站点把 src 改了回来，重新伪装一次
      if (img.getAttribute('src') === img.getAttribute(ATTR_TARGET)) return;
      const tries = Number(img.getAttribute(ATTR_TRIES) || '0') + 1;
      if (tries > MAX_TRIES) return;
      img.setAttribute(ATTR_TRIES, String(tries));
      img.setAttribute(ATTR_ORIGINAL, img.getAttribute('src') || '');
      img.removeAttribute(ATTR_STATE);
    } else if (state === 'pending' || state === 'failed' || state === 'restored') {
      return;
    }

    this.observeViewport(img, rule);
  }

  private observeViewport(img: HTMLImageElement, rule: AvatarRule): void {
    if (this.waiting.has(img)) return;
    this.waiting.add(img);
    if (!this.viewport) {
      this.viewport = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLImageElement;
            this.viewport?.unobserve(target);
            this.waiting.delete(target);
            this.enqueue(target, rule);
          }
        },
        { rootMargin: CONFIG.rootMargin },
      );
    }
    this.viewport.observe(img);
  }

  private enqueue(img: HTMLImageElement, rule: AvatarRule): void {
    if (!this.enabled || !img.isConnected) return;

    const state = img.getAttribute(ATTR_STATE);
    if (state === 'pending' || state === 'masked') return;

    const seed = this.adapter.getSeed(img);
    if (!seed) return;

    // 尺寸必须在替换前、原图还显示着的时候测量；图片未加载完时布局尺寸不可信
    if (!img.complete) {
      img.addEventListener('load', () => this.enqueue(img, rule), { once: true });
      img.addEventListener('error', () => this.enqueue(img, rule), { once: true });
      return;
    }

    const box = this.readBox(img);
    if (!box) return;

    // 请求尺寸始终是 CONFIG.size，同一用户全站只对应一个 URL
    const url = buildUrl(seed);

    if (this.failed.has(url)) {
      img.setAttribute(ATTR_STATE, 'failed');
      return;
    }

    // 先锁定尺寸，再入队等图：这样即使新图是 128px，槽位也不会被撑开或抖动
    this.pinBox(img, box);

    if (!img.hasAttribute(ATTR_ORIGINAL)) {
      img.setAttribute(ATTR_ORIGINAL, img.getAttribute('src') || '');
    }
    img.setAttribute(ATTR_TARGET, url);
    img.setAttribute(ATTR_STATE, 'pending');

    this.queue.push({ img, url });
    this.pump();
  }

  /**
   * 读取「官方排版」的头像尺寸。
   * 已经是我们插入的图时不能量它，改用上次记录的尺寸。
   */
  private readBox(img: HTMLImageElement): Box | null {
    if (isMaskedSrc(img.getAttribute('src')) || img.getAttribute(ATTR_STATE) === 'masked') {
      const stored = img.getAttribute(ATTR_BOX);
      const [w, h] = (stored || '').split('x').map(Number);
      if (w >= 1 && h >= 1) return { width: w, height: h };
    }
    return measureBox(img);
  }

  private pump(): void {
    while (this.enabled && this.queue.length > 0) {
      const job = this.queue[0];
      const shared = this.inflight.get(job.url);

      if (shared) {
        this.queue.shift();
        const gen = this.generation;
        void shared.then((ok) => {
          if (gen === this.generation) this.finish(job, ok);
        });
        continue;
      }

      if (this.active >= CONFIG.concurrency) return;

      this.queue.shift();
      this.active += 1;

      const gen = this.generation;
      const task = this.preload(job.url);
      this.inflight.set(job.url, task);

      void task
        .then((ok) => {
          if (gen === this.generation) this.finish(job, ok);
        })
        .finally(() => {
          // 只有仍然是这一代请求时才回收计数，避免「还原 → 重新伪装」后 active 变负数
          if (gen === this.generation) {
            this.active -= 1;
            if (this.inflight.get(job.url) === task) this.inflight.delete(job.url);
            this.pump();
          }
        });
    }
  }

  private preload(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const probe = new Image();
      // 头像服务通常配置了防盗链白名单，Referer 策略不匹配会导致 403
      probe.referrerPolicy = CONFIG.referrerPolicy;
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const done = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (timer !== undefined) clearTimeout(timer);
        probe.onload = null;
        probe.onerror = null;
        probe.removeAttribute('src');
        resolve(ok);
      };

      timer = setTimeout(() => done(false), CONFIG.preloadTimeoutMs);

      probe.onload = () => {
        // 服务端出错时会返回 200 + 固定尺寸的错误图，用尺寸识别并保留原头像
        const isErrorImage =
          probe.naturalWidth === CONFIG.errorImageSize &&
          probe.naturalHeight === CONFIG.errorImageSize;
        done(probe.naturalWidth > 0 && !isErrorImage);
      };
      probe.onerror = () => done(false);
      probe.src = url;
    });
  }

  private finish(job: Job, ok: boolean): void {
    if (!this.enabled) return;
    const { img, url } = job;
    if (!img.isConnected) return;
    // 期间被还原/重新伪装过，这次结果已经过期
    if (img.getAttribute(ATTR_TARGET) !== url) return;

    if (!ok) {
      this.failed.add(url);
      this.stats.failed += 1;
      if (img.getAttribute(ATTR_TARGET) === url) {
        img.setAttribute(ATTR_STATE, 'failed');
        // 入队时已经锁了尺寸，失败要还原，否则空的 style 会一直挂在元素上
        this.unpinBox(img);
      }
      return;
    }

    const original = img.currentSrc || img.src || '';
    img.setAttribute(ATTR_STATE, 'masked');
    // 尺寸在入队时就已锁定，这里只需要换图
    // 命中浏览器缓存时不会重新发请求；未命中时同样要遵循配置的 Referer 策略
    img.setAttribute('referrerpolicy', CONFIG.referrerPolicy);
    img.setAttribute('src', url);
    this.stats.masked += 1;
    this.hooks.onSwap?.(img, original);
  }

  private pinBox(img: HTMLImageElement, box: Box): void {
    if (!(box.width >= 1 && box.height >= 1)) return;
    if (!img.hasAttribute(ATTR_STYLE)) {
      img.setAttribute(ATTR_STYLE, img.getAttribute('style') || '');
    }
    img.setAttribute(ATTR_BOX, `${box.width}x${box.height}`);
    img.style.width = `${box.width}px`;
    img.style.height = `${box.height}px`;
  }

  private unpinBox(img: HTMLImageElement): void {
    const style = img.getAttribute(ATTR_STYLE);
    if (style !== null) {
      if (style) img.setAttribute('style', style);
      else img.removeAttribute('style');
      img.removeAttribute(ATTR_STYLE);
    }
    img.removeAttribute(ATTR_BOX);
  }

  private onMutations(records: MutationRecord[]): void {
    for (const record of records) this.collect(record);
    if (this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const batch = [...this.candidates];
      this.candidates.clear();
      for (const img of batch) {
        const rule = this.ruleFor(img);
        if (rule) this.consider(img, rule);
      }
    });
  }

  private collect(record: MutationRecord): void {
    if (record.type === 'attributes') {
      const target = record.target;
      if (target instanceof HTMLImageElement && this.ruleFor(target)) {
        this.candidates.add(target);
      }
      return;
    }

    const selector = this.adapter.rules.map((rule) => rule.selectors.join(',')).join(',');
    for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node instanceof HTMLImageElement && this.ruleFor(node)) {
        this.candidates.add(node);
      }
      node.querySelectorAll<HTMLImageElement>(selector).forEach((img) => {
        if (this.ruleFor(img)) this.candidates.add(img);
      });
    }
  }
}
