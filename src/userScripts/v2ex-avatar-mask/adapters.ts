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

// 新增站点时在这里追加一条配置即可，核心管线无需改动。
export const ADAPTERS: SiteAdapter[] = [v2ex, linuxDo];

export function resolveAdapter(url: URL): SiteAdapter | null {
  return ADAPTERS.find((adapter) => adapter.matches(url)) ?? null;
}
