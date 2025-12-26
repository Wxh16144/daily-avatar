export interface Config {
  enabled: boolean;
  autoStart: boolean;
  updateInterval: number;
  updateTime: string;
  checkOnLoad: boolean;
  enableNotifications: boolean;
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  notifyOnStart: boolean;
  retryOnFail: boolean;
  maxRetries: number;
  retryInterval: number;
  debugMode: boolean;
  logToConsole: boolean;
  avatarSource: 'random' | 'api';
  apiUrl: string;
}
