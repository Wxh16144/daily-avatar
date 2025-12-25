
// 默认配置
export const DEFAULT_CONFIG = {
  // 基本设置
  enabled: true,
  autoStart: true,

  // 时间设置
  updateInterval: 24 * 60 * 60 * 1000, // 24小时
  updateTime: '09:00', // 每天更新时间
  checkOnLoad: true, // 页面加载时检查


  // 通知设置
  enableNotifications: true,
  notifyOnSuccess: true,
  notifyOnFailure: true,
  notifyOnStart: false,

  // 高级设置
  retryOnFail: true,
  maxRetries: 3,
  retryInterval: 5 * 60 * 1000, // 5分钟

  // 调试
  debugMode: false,
  logToConsole: true,

  // 源设置
  avatarSource: 'api', // 'api' | 'unsplash' | 'custom'
  apiUrl: '',
  unsplashKey: '',
};