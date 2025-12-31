export interface Config {
  /** 是否启用 */
  enabled: boolean;
  /** 是否自动启动 */
  autoStart: boolean;

  /** 更新间隔，单位毫秒 */
  updateInterval: number;
  /** 每天更新时间，格式为 HH:mm */
  updateTime: string;
  /** 页面加载时是否检查更新 */
  checkOnLoad: boolean;
  /** 是否启用通知 */
  enableNotifications: boolean;
  /** 成功时是否通知 */
  notifyOnSuccess: boolean;
  /** 失败时是否通知 */
  notifyOnFailure: boolean;
  /** 开始时是否通知 */
  notifyOnStart: boolean;
  // /** 失败时是否重试 */
  // retryOnFail: boolean;
  // /** 最大重试次数 */
  // maxRetries: number;
  // /** 重试间隔，单位毫秒 */
  // retryInterval: number;
  /** 头像来源 */
  avatarSource: 'random' | 'api';
  /** 自定义 API 地址 */
  apiUrl: string;
}
