import type { AvatarRule, SiteAdapter } from './types';

/**
 * V2EX 的头像写法不统一，这里只声明「怎么认出它们」。
 * 顺序即优先级：越具体的规则越靠前。
 */
const v2exRules: AvatarRule[] = [
  {
    name: '主题作者大图',
    selectors: ['.header img.avatar'],
  },
  {
    name: '回复区',
    selectors: ['[data-reply-id] img.avatar'],
  },
  {
    name: '首页最近查看过的主题',
    selectors: ['.cell.from_ a[href*="/member/"] img'],
  },
  {
    name: '列表 / 顶栏头像',
    selectors: ['img.avatar', 'a[href*="/member/"] img'],
  },
];

const v2ex: SiteAdapter = {
  id: 'v2ex',
  matches: (url) => url.hostname === 'v2ex.com' || url.hostname === 'www.v2ex.com',
  rules: v2exRules,
  getSeed: (img) => {
    const alt = img.alt.trim();
    if (alt) return alt;

    const uid = img.getAttribute('data-uid')?.trim();
    if (uid) return uid;

    const href = img.closest('a[href*="/member/"]')?.getAttribute('href');
    const match = href?.match(/\/member\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  },
};

/**
 * linux.do 基于 Discourse：
 * - 头像统一是 `img.avatar`，`alt` 为空，主题页连 `title` 也没有
 * - 用户名只存在于 URL 路径里：
 *     /user_avatar/linux.do/<username>/<size>/<hash>_<n>.png
 *     /letter_avatar/<username>/<size>/<hash>.png
 * 所以 seed 优先从 src 解析，title/alt 只作为兜底。
 */
const LD_USER_AVATAR = /\/user_avatar\/[^/]+\/([^/]+)\//;
const LD_LETTER_AVATAR = /\/letter_avatar\/([^/]+)\//;

/** 站长的头像保持原样，不参与替换 */
const LD_EXCLUDE = [
  'img.avatar[src*="/user_avatar/linux.do/neo/"]',
  'img.avatar[src*="/letter_avatar/neo/"]',
];

const linuxDo: SiteAdapter = {
  id: 'linux-do',
  matches: (url) => url.hostname === 'linux.do',
  rules: [
    {
      name: '头像',
      selectors: ['img.avatar'],
      exclude: LD_EXCLUDE,
    },
  ],
  getSeed: (img) => {
    const src = img.getAttribute('src') || img.currentSrc || '';

    const fromUrl = src.match(LD_USER_AVATAR) ?? src.match(LD_LETTER_AVATAR);
    if (fromUrl) return decodeURIComponent(fromUrl[1]);

    // 列表页的 title 形如 "Neo - 原始发帖人"
    const title = (img.getAttribute('title') || '').split(' - ')[0].trim();
    if (title) return title;

    return img.alt.trim() || null;
  },
};

/**
 * 知乎：头像是 `img.Avatar`（注意是大写 A），页面是 React SPA。
 *
 * seed 用图片 id（32 位 hex），前后缀一并去掉：
 *   v2-52556cb0ba7ef67af15bd02532ee27e4_l.jpg     -> 52556cb0...
 *   v2-52556cb0ba7ef67af15bd02532ee27e4_qhd.jpg   -> 同上
 *   7c0d3d719be6ce13c6d64f9cd3a0cd60_l.jpg        -> 7c0d3d71...
 * 实测同一张图在 src 与 srcset 里的 id 完全一致，不同后缀也只是同一 id 的变体，
 * 所以同一个人在任何位置都会落到同一个丑头像。
 *
 * 兜底顺序：图片 id -> `a[href*="/people/"]` 的 url_token -> alt 显示名。
 *
 * 注意：知乎的图片一律带 srcset，脚本会把它覆盖成 `<url> 1x`（详见 pipeline）。
 */
const ZH_IMAGE_ID = /(?:^|\/)(?:v\d+-)?([0-9a-f]{32})(?:[_./-]|$)/i;
const ZH_PEOPLE = /\/people\/([^/?#]+)/;
const ZH_ALT_PROFILE = /^点击打开(.+?)的主页$/;

function zhihuImageId(img: HTMLImageElement): string | null {
  for (const raw of [img.getAttribute('src'), img.getAttribute('srcset')]) {
    if (!raw) continue;
    // srcset 可能有多项，逐个看
    for (const candidate of raw.split(',')) {
      const id = candidate.trim().split(/\s+/)[0]?.match(ZH_IMAGE_ID);
      if (id) return id[1].toLowerCase();
    }
  }
  return null;
}

const zhihu: SiteAdapter = {
  id: 'zhihu',
  matches: (url) =>
    url.hostname === 'zhihu.com' || url.hostname.endsWith('.zhihu.com'),
  rules: [
    {
      name: '头像',
      selectors: ['img.Avatar'],
    },
  ],
  getSeed: (img) => {
    const imageId = zhihuImageId(img);
    if (imageId) return imageId;

    const href = img.closest('a[href*="/people/"]')?.getAttribute('href');
    const token = href?.match(ZH_PEOPLE);
    if (token) return decodeURIComponent(token[1]);

    const alt = img.alt.trim();
    if (alt) {
      const profile = alt.match(ZH_ALT_PROFILE);
      if (profile) return profile[1].trim();
      if (!/^(点击|查看|打开)/.test(alt)) return alt;
    }

    return null;
  },
};

// 新增站点时在这里追加一条配置即可，核心管线无需改动。
export const ADAPTERS: SiteAdapter[] = [v2ex, linuxDo, zhihu];

export function resolveAdapter(url: URL): SiteAdapter | null {
  return ADAPTERS.find((adapter) => adapter.matches(url)) ?? null;
}
