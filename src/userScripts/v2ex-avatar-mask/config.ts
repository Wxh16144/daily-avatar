/**
 * 用户可编辑常量。
 * 构建后这段配置会保留在脚本顶部，方便直接在油猴编辑器中修改。
 *
 * host        头像服务地址（必须是 HTTPS，V2EX 是 HTTPS 页面）
 * urlTemplate 生成规则，占位符：{host} {id} {format} {size}
 * format      服务端输出格式
 * size        全局唯一边长：每个用户只对应一个 URL，服务端只需渲染一次
 * effect      particles | fade | none
 */
export interface UserConfig {
  host: string;
  urlTemplate: string;
  format: string;
  /**
   * 唯一边长。不要按位置区分尺寸：
   * 同一用户在不同位置用不同 s 会产生多个 URL，服务端每个都要重新渲染。
   * 显示大小由脚本在替换前测量原始头像的布局尺寸并写入 inline style，与请求尺寸无关。
   */
  size: number;
  concurrency: number;
  effect: 'particles' | 'fade' | 'none';
  effectConcurrency: number;
  effectStaggerMs: number;
  effectDurationMs: number;
  maxParticles: number;
  preloadTimeoutMs: number;
  rootMargin: string;
  /**
   * 请求头像时的 referrerPolicy。
   * - 'no-referrer'：不发送 Referer，兼容「配置了 ALLOWED_ORIGINS 且允许空 Referer」的服务端
   * - 'no-referrer-when-downgrade'：浏览器默认，兼容「白名单已加入 v2ex.com 且禁止空 Referer」的服务端
   */
  referrerPolicy: ReferrerPolicy;
  /** 服务端出错时返回的错误图尺寸，必须与 size 不同才能用于识别错误响应 */
  errorImageSize: number;
}

export const CONFIG: UserConfig = {
  host: 'https://avatar.wxhboy.cn',
  urlTemplate: '{host}/{id}.{format}?s={size}',
  format: 'webp',
  size: 128,
  concurrency: 6,
  effect: 'particles',
  effectConcurrency: 3,
  effectStaggerMs: 60,
  effectDurationMs: 450,
  maxParticles: 25,
  preloadTimeoutMs: 10000,
  rootMargin: '200px',
  referrerPolicy: 'no-referrer',
  errorImageSize: 256,
};
