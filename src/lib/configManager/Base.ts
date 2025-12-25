
// 通用配置管理基类
export interface BaseConfigManager<TConfig = any, TState = any> {
  config: TConfig;
  state: TState;

  loadConfig(): TConfig | Promise<TConfig>;
  saveConfig(newConfig: Partial<TConfig>): boolean | Promise<boolean>;
  resetConfig(): boolean | Promise<boolean>;
  getConfig(): TConfig;

  loadState(): TState | Promise<TState>;
  saveState(newState: Partial<TState>): boolean | Promise<boolean>;
  getStats(): any;
  cleanupOldData(daysToKeep?: number): boolean | Promise<boolean>;
  exportData(): any;
  importData(data: any): boolean | Promise<boolean>;
  listStorage(): string[] | Promise<string[]>;
  clearAllData(): boolean | Promise<boolean>;

  recordSuccess(imageUrl?: string): TState | Promise<TState>;
  recordError(error: any): TState | Promise<TState>;
  hasUpdatedToday(): boolean;
}
