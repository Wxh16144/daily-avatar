/**
 * 一条头像规则：只负责认出「哪些元素是头像」，不声明尺寸。
 * 尺寸在替换前从原始头像的布局尺寸动态读取并记忆。
 */
export interface AvatarRule {
  /** 规则名，便于排查 */
  name: string;
  /** 命中头像的 CSS 选择器 */
  selectors: string[];
}

export interface SiteAdapter {
  id: string;
  matches: (url: URL) => boolean;
  /** 按优先级排列，先命中的规则生效 */
  rules: AvatarRule[];
  /** 从头像元素提取稳定且唯一的 seed */
  getSeed: (img: HTMLImageElement) => string | null;
}

export interface PipelineStats {
  masked: number;
  failed: number;
  pending: number;
  active: number;
}
