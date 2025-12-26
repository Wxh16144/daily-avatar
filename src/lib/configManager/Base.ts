import type { Config } from '@/types/config';
import type { State } from '@/types/state';

// 通用配置管理基类
export abstract class BaseConfigManager<TConfig extends Config = Config, TState extends State = State> {
  abstract config: TConfig;
  abstract state: TState;

  abstract loadConfig(): TConfig | Promise<TConfig>;
  abstract saveConfig(newConfig: Partial<TConfig>): boolean | Promise<boolean>;
  abstract resetConfig(): boolean | Promise<boolean>;
  abstract getConfig(): TConfig;

  abstract loadState(): TState | Promise<TState>;
  abstract saveState(newState: Partial<TState>): boolean | Promise<boolean>;
  protected abstract getDefaultState(): TState;
  abstract listStorage(): string[] | Promise<string[]>;
  abstract clearAllData(): boolean | Promise<boolean>;

  recordSuccess(): TState | Promise<TState> {
    const now = Date.now();
    const newState: Partial<TState> = {
      lastUpdate: now,
      lastResult: 'success' as const,
      lastErrorMessage: null,
      isUpdating: false,
      nextScheduledUpdate: now + this.config.updateInterval,
    } as Partial<TState>;

    const result = this.saveState(newState);
    if (result instanceof Promise) {
      return result.then(() => this.state);
    }
    return this.state;
  }

  recordError(error: Error | { message: string }): TState | Promise<TState> {
    const now = Date.now();
    const newState: Partial<TState> = {
      lastUpdate: now,
      lastResult: 'failure' as const,
      lastErrorMessage: error.message || 'Unknown error',
      isUpdating: false,
    } as Partial<TState>;

    const result = this.saveState(newState);
    if (result instanceof Promise) {
      return result.then(() => this.state);
    }
    return this.state;
  }

  getStats(): {
    lastUpdateTime: number;
    timeUntilNextUpdate: number;
    nextUpdateTime: number;
    hasUpdatedToday: boolean;
    lastResult: 'success' | 'failure' | null;
    lastErrorMessage: string | null;
  } {
    const now = Date.now();
    const lastUpdate = this.state.lastUpdate;
    
    // 下一次更新时间
    const nextUpdate = this.state.nextScheduledUpdate ||
      (lastUpdate ? lastUpdate + this.config.updateInterval : now + this.config.updateInterval);
    const timeUntilNextUpdate = Math.max(0, nextUpdate - now);

    return {
      lastUpdateTime: lastUpdate,
      timeUntilNextUpdate: timeUntilNextUpdate,
      nextUpdateTime: nextUpdate,
      hasUpdatedToday: this.hasUpdatedToday(),
      lastResult: this.state.lastResult,
      lastErrorMessage: this.state.lastErrorMessage
    };
  }

  hasUpdatedToday() {
    if (!this.state.lastUpdate || this.state.lastResult !== 'success') return false;

    const last = new Date(this.state.lastUpdate);
    const today = new Date();

    return last.getDate() === today.getDate() &&
      last.getMonth() === today.getMonth() &&
      last.getFullYear() === today.getFullYear();
  }
}
