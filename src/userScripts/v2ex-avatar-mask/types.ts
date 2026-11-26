/**
 * 一条头像规则：只负责认出「哪些元素是头像」，不声明尺寸。
 * 尺寸在替换前从原始头像的布局尺寸动态读取并记忆。
 */
export interface AvatarRule {
  /** 规则名，便于排查 */
  name: string;
  /** 命中头像的 CSS 选择器 */
  selectors: string[];
  /**
   * 排除的选择器：命中其中任意一条就跳过该元素。
   * 用于「除了某几个人之外全部替换」这类需求。
   */
  exclude?: string[];
}

export interface SiteAdapter {
  id: string;
  matches: (url: URL) => boolean;
  /** 按优先级排列，先命中的规则生效 */
  rules: AvatarRule[];
  /** 从头像元素提取稳定且唯一的 seed */
  getSeed: (img: HTMLImageElement) => string | null;
}

/**
 * 处理方式：
 * - mask：下载生成的丑头像并替换
 * - blur：只给原头像加 CSS 模糊，不发任何请求
 */
export type MaskMode = 'mask' | 'blur';

export interface PipelineStats {
  masked: number;
  blurred: number;
  failed: number;
  pending: number;
  active: number;
}
