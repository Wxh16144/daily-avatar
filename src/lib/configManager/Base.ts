import type { Config } from '@/types/config';
import type { State, UpdateLog } from '@/types/state';
import type { IConfigStorage } from './IConfigStorage';

// 通用配置管理基类
export abstract class BaseConfigManager<
  TConfig extends Config = Config,
  TState extends State = State>
  implements IConfigStorage<TConfig, TState> {
  abstract config: TConfig;
  abstract state: TState;

  abstract loadConfig(): TConfig | Promise<TConfig>;
  abstract saveConfig(newConfig: Partial<TConfig>): boolean | Promise<boolean>;
  abstract resetConfig(): boolean | Promise<boolean>;
  abstract getConfig(): TConfig;

  abstract loadState(): TState | Promise<TState>;
  abstract saveState(newState: Partial<TState>): boolean | Promise<boolean>;
  abstract listStorage(): string[] | Promise<string[]>;
  abstract clearAllData(): boolean | Promise<boolean>;

  recordSuccess(): TState | Promise<TState> {
    const now = Date.now();
    const newLog: UpdateLog = { timestamp: now, result: 'success' };
    const history = [newLog, ...(this.state.history || [])].slice(0, 20);

    const newState: Partial<TState> = {
      lastUpdate: now,
      lastResult: 'success' as const,
      lastErrorMessage: null,
      isUpdating: false,
      nextScheduledUpdate: now + this.config.updateInterval,
      history,
    } as Partial<TState>;

    const result = this.saveState(newState);
    if (result instanceof Promise) {
      return result.then(() => this.state);
    }
    return this.state;
  }

  recordError(error: Error | { message: string }): TState | Promise<TState> {
    const now = Date.now();
    const newLog: UpdateLog = { timestamp: now, result: 'failure', message: error.message || 'Unknown error' };
    const history = [newLog, ...(this.state.history || [])].slice(0, 20);

    const newState: Partial<TState> = {
      lastUpdate: now,
      lastResult: 'failure' as const,
      lastErrorMessage: error.message || 'Unknown error',
      isUpdating: false,
      history,
    } as Partial<TState>;

    const result = this.saveState(newState);
    if (result instanceof Promise) {
      return result.then(() => this.state);
    }
    return this.state;
  }

  getState(): TState {
    return this.state;
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
