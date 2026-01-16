// 通用存储接口，建议所有配置管理器实现
export interface IConfigStorage<T, S> {
  loadConfig(): Promise<T> | T;
  saveConfig(newConfig: Partial<T>): Promise<boolean> | boolean;
  resetConfig(): Promise<boolean> | boolean;
  getConfig(): T;
  loadState(): Promise<S> | S;
  saveState(newState: Partial<S>): Promise<boolean> | boolean;
  listStorage(): Promise<string[]> | string[];
  clearAllData(): Promise<boolean> | boolean;

  recordSuccess(): Promise<S> | S;
  recordError(error: Error | { message: string }): Promise<S> | S;
  getState(): S;
  hasUpdatedToday(): boolean;

  getMoodAvatar(day: string): Promise<string | null> | string | null;
  saveMoodAvatar(day: string, base64: string): Promise<boolean> | boolean;
}
