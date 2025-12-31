import type { Config } from "@/types/config";

// 默认配置
export const DEFAULT_CONFIG: Config = {
  // 基本设置
  enabled: true,
  autoStart: true,

  // 时间设置
  updateInterval: 24 * 60 * 60 * 1000, // 24小时
  checkOnLoad: true, // 页面加载时检查

  // 通知设置
  enableNotifications: true,
  notifyOnSuccess: true,
  notifyOnFailure: true,
  notifyOnStart: false,

  // 源设置
  avatarSource: 'random',
  apiUrl: '',
};
