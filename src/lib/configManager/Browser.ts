import { openDB, type DBSchema } from 'idb';
import { DEFAULT_CONFIG } from '@/constants/defaultConf';
import type { Config } from '@/types/config';
import type { State } from '@/types/state';
import type { BaseConfigManager } from './Base';

interface AvatarDB extends DBSchema {
  'config-store': {
    key: string;
    value: any;
  };
  'state-store': {
    key: string;
    value: any;
  };
}

const dbPromise = openDB<AvatarDB>('daily-avatar', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('config-store')) {
      db.createObjectStore('config-store');
    }
    if (!db.objectStoreNames.contains('state-store')) {
      db.createObjectStore('state-store');
    }
  },
});

export class BrowserConfigManager implements BaseConfigManager<Config, State> {
  config: Config;
  state: State;

  constructor() {
    // 初始化默认值，避免在异步加载完成前为 undefined
    this.config = { ...DEFAULT_CONFIG };
    this.state = this.getDefaultState();

    // 触发异步加载
    this.loadConfig();
    this.loadState();
  }

  async loadConfig(): Promise<Config> {
    const db = await dbPromise;
    const savedConfig = await db.get('config-store', 'avatarConfig');

    if (!savedConfig) {
      await db.put('config-store', DEFAULT_CONFIG, 'avatarConfig');
      const config = { ...DEFAULT_CONFIG };
      this.config = config;
      return config;
    }

    const config = { ...DEFAULT_CONFIG, ...savedConfig };
    this.config = config;
    return config;
  }

  async saveConfig(newConfig: Partial<Config>): Promise<boolean> {
    this.config = { ...this.config, ...newConfig };
    const db = await dbPromise;
    await db.put('config-store', this.config, 'avatarConfig');
    return true;
  }

  async resetConfig(): Promise<boolean> {
    const db = await dbPromise;
    await db.put('config-store', DEFAULT_CONFIG, 'avatarConfig');
    this.config = { ...DEFAULT_CONFIG };
    return true;
  }

  getConfig(): Config {
    return { ...this.config };
  }

  private getDefaultState(): State {
    return {
      lastUpdate: 0,
      lastSuccess: 0,
      lastError: null,
      errorCount: 0,
      successCount: 0,
      totalUpdates: 0,
      lastImageUrl: '',
      isUpdating: false,
      nextScheduledUpdate: 0,
      updateHistory: []
    };
  }

  async loadState(): Promise<State> {
    const defaultState = this.getDefaultState();
    const db = await dbPromise;
    const savedState = await db.get('state-store', 'avatarState');

    const state = savedState ? { ...defaultState, ...savedState } : defaultState;
    this.state = state;
    return state;
  }

  async saveState(newState: any): Promise<boolean> {
    this.state = { ...this.state, ...newState };
    if (this.state.updateHistory && this.state.updateHistory.length > 100) {
      this.state.updateHistory = this.state.updateHistory.slice(-100);
    }
    const db = await dbPromise;
    await db.put('state-store', this.state, 'avatarState');
    return true;
  }

  async recordSuccess(imageUrl = ''): Promise<State> {
    const now = Date.now();
    const newState: any = {
      lastUpdate: now,
      lastSuccess: now,
      lastError: null,
      successCount: this.state.successCount + 1,
      totalUpdates: this.state.totalUpdates + 1,
      lastImageUrl: imageUrl,
      isUpdating: false,
      nextScheduledUpdate: now + this.config.updateInterval,
      updateHistory: [
        ...(this.state.updateHistory || []),
        {
          timestamp: now,
          status: 'success',
          imageUrl: imageUrl
        }
      ]
    };

    await this.saveState(newState);
    return this.state;
  }

  async recordError(error: any): Promise<State> {
    const now = Date.now();
    const newState: any = {
      lastUpdate: now,
      lastError: {
        message: error.message,
        timestamp: now,
        code: error.code || 'UNKNOWN'
      },
      errorCount: this.state.errorCount + 1,
      totalUpdates: this.state.totalUpdates + 1,
      isUpdating: false,
      updateHistory: [
        ...(this.state.updateHistory || []),
        {
          timestamp: now,
          status: 'error',
          error: error.message
        }
      ]
    };

    await this.saveState(newState);
    return this.state;
  }

  hasUpdatedToday(): boolean {
    if (!this.state.lastSuccess) return false;

    const lastUpdate = new Date(this.state.lastSuccess);
    const today = new Date();

    return (
      lastUpdate.getDate() === today.getDate() &&
      lastUpdate.getMonth() === today.getMonth() &&
      lastUpdate.getFullYear() === today.getFullYear()
    );
  }

  getStats(): any {
    const now = Date.now();
    const lastUpdate = this.state.lastSuccess;
    const timeSinceLastUpdate = lastUpdate ? now - lastUpdate : null;

    // 计算成功率
    const total = this.state.totalUpdates;
    const success = this.state.successCount;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    // 下一次更新时间
    const nextUpdate = this.state.nextScheduledUpdate ||
      (lastUpdate ? lastUpdate + this.config.updateInterval : now + this.config.updateInterval);
    const timeUntilNextUpdate = Math.max(0, nextUpdate - now);

    return {
      totalUpdates: total,
      successCount: success,
      errorCount: this.state.errorCount,
      successRate: successRate,
      lastUpdateTime: lastUpdate,
      timeSinceLastUpdate: timeSinceLastUpdate,
      timeUntilNextUpdate: timeUntilNextUpdate,
      nextUpdateTime: nextUpdate,
      hasUpdatedToday: this.hasUpdatedToday(),
      lastError: this.state.lastError
    };
  }

  cleanupOldData(daysToKeep = 30): boolean {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

    if (this.state.updateHistory) {
      const filteredHistory = this.state.updateHistory.filter(
        (entry: any) => entry.timestamp >= cutoff
      );

      this.saveState({
        updateHistory: filteredHistory
      });
    }

    return true;
  }

  exportData(): any {
    return {
      config: this.config,
      state: this.state,
      version: '1.0',
      exportDate: new Date().toISOString()
    };
  }

  importData(data: any): boolean {
    if (data.config) {
      this.saveConfig(data.config);
    }
    if (data.state) {
      this.saveState(data.state);
    }
    return true;
  }

  async listStorage(): Promise<string[]> {
    const db = await dbPromise;
    const configKeys = await db.getAllKeys('config-store');
    const stateKeys = await db.getAllKeys('state-store');
    // 简单的合并 key，实际可能需要区分 store
    return [...configKeys.map(k => `config:${k}`), ...stateKeys.map(k => `state:${k}`)];
  }

  async clearAllData(): Promise<boolean> {
    const db = await dbPromise;
    await db.clear('config-store');
    await db.clear('state-store');
    this.config = { ...DEFAULT_CONFIG };
    this.state = this.getDefaultState();
    return true;
  }
}
