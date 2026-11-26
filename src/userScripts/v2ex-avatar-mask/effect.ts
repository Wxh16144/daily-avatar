import { CONFIG } from './config';

const LAYER_STYLE =
  'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647;';

const cssUrl = (url: string) => url.replace(/["\\\n\r]/g, '');

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Snapshot {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SwapEffect {
  play: (img: HTMLImageElement, originalUrl: string) => void;
  cancelAll: () => void;
}

export function createSwapEffect(): SwapEffect {
  const queue: Array<() => void> = [];
  let active = 0;
  let nextSlot = 0;
  let layer: HTMLDivElement | null = null;
  let particles = 0;

  const reduced = () => CONFIG.effect === 'none' || prefersReducedMotion();

  function ensureLayer(): HTMLDivElement {
    if (layer) return layer;
    const el = document.createElement('div');
    el.setAttribute('data-ua-layer', '');
    el.style.cssText = LAYER_STYLE;
    document.body.appendChild(el);
    layer = el;
    return el;
  }

  function releaseLayer() {
    if (!layer || particles > 0) return;
    layer.remove();
    layer = null;
  }

  function fade(img: HTMLImageElement) {
    if (reduced() || !img.isConnected) return;
    img.animate(
      [{ opacity: 0.2 }, { opacity: 1 }],
      { duration: 160, easing: 'ease-out' },
    );
  }

  function spawn(img: HTMLImageElement, originalUrl: string, rect: Snapshot) {
    if (!img.isConnected || !originalUrl) {
      fade(img);
      return;
    }

    // 排队期间滚出视口就不必再播粒子，避免在屏幕外浪费合成
    const offscreen =
      rect.top < -rect.height ||
      rect.left < -rect.width ||
      rect.top > window.innerHeight ||
      rect.left > window.innerWidth;
    if (offscreen) {
      fade(img);
      return;
    }

    if (rect.width < 8 || rect.height < 8) {
      fade(img);
      return;
    }

    const cap = Math.max(2, Math.floor(Math.sqrt(CONFIG.maxParticles)));
    const grid = Math.min(rect.width >= 40 ? 5 : 3, cap);
    const cellW = rect.width / grid;
    const cellH = rect.height / grid;
    const host = ensureLayer();
    const batch: HTMLDivElement[] = [];

    particles += 1;
    for (let row = 0; row < grid; row += 1) {
      for (let col = 0; col < grid; col += 1) {
        const particle = document.createElement('div');
        particle.style.cssText = [
          'position:absolute',
          `left:${rect.left + col * cellW}px`,
          `top:${rect.top + row * cellH}px`,
          `width:${cellW}px`,
          `height:${cellH}px`,
          `background-image:url("${cssUrl(originalUrl)}")`,
          `background-size:${rect.width}px ${rect.height}px`,
          `background-position:${-col * cellW}px ${-row * cellH}px`,
          'background-repeat:no-repeat',
          'will-change:transform,opacity',
        ].join(';');
        host.appendChild(particle);
        batch.push(particle);

        const dx = ((col + 0.5) / grid - 0.5) * rect.width * 1.6 + (Math.random() - 0.5) * 12;
        const dy =
          ((row + 0.5) / grid - 0.5) * rect.height * 1.6 - 12 - Math.random() * 18;
        const rotate = (Math.random() - 0.5) * 120;

        particle.animate(
          [
            { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
            {
              transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(0.4)`,
              opacity: 0,
            },
          ],
          {
            duration: CONFIG.effectDurationMs,
            easing: 'cubic-bezier(.22,.61,.36,1)',
            fill: 'forwards',
          },
        );
      }
    }

    window.setTimeout(() => {
      batch.forEach((particle) => particle.remove());
      particles -= 1;
      releaseLayer();
    }, CONFIG.effectDurationMs + 60);
  }

  function pump() {
    while (active < CONFIG.effectConcurrency && queue.length > 0) {
      const task = queue.shift()!;
      const now = performance.now();
      const start = Math.max(now, nextSlot);
      nextSlot = start + CONFIG.effectStaggerMs;
      active += 1;

      window.setTimeout(
        () => {
          try {
            task();
          } finally {
            window.setTimeout(() => {
              active -= 1;
              pump();
            }, CONFIG.effectDurationMs);
          }
        },
        start - now,
      );
    }
  }

  return {
    play(img, originalUrl) {
      if (reduced()) {
        fade(img);
        return;
      }
      // 位置必须在换图那一刻锁定，排队等待期间用户滚动会导致粒子错位
      const box = img.getBoundingClientRect();
      const snapshot: Snapshot = {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
      };
      queue.push(() => spawn(img, originalUrl, snapshot));
      pump();
    },
    cancelAll() {
      queue.length = 0;
      active = 0;
      nextSlot = 0;
      particles = 0;
      layer?.remove();
      layer = null;
    },
  };
}
