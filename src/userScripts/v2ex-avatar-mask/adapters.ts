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

// 新增站点时在这里追加一条配置即可，核心管线无需改动。
export const ADAPTERS: SiteAdapter[] = [v2ex];

export function resolveAdapter(url: URL): SiteAdapter | null {
  return ADAPTERS.find((adapter) => adapter.matches(url)) ?? null;
}
