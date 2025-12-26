import { DEFAULT_CONFIG } from '@/constants/defaultConf';
import type { BaseConfigManager } from '@/lib/configManager/Base';
import { defaultState } from '@/constants/defaultState';
import type { Config } from "@/types/config";
import type { State } from "@/types/state";

export class TampermonkeyConfigManager implements BaseConfigManager<Config, State> {
  config: Config;
  state: State;
  constructor() {
    this.config = {} as Config;
    this.state = {} as State;
  }
  loadConfig(): Config {
    const savedConfig = GM_getValue('avatarConfig');
    if (!savedConfig) {
      GM_setValue('avatarConfig', DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    return { ...DEFAULT_CONFIG, ...savedConfig };
  }

  saveConfig(newConfig: Partial<Config>): boolean {
    this.config = { ...this.config, ...newConfig };
    GM_setValue('avatarConfig', this.config);
    return true;
  }

  resetConfig(): boolean {
    GM_setValue('avatarConfig', DEFAULT_CONFIG);
    this.config = DEFAULT_CONFIG;
    return true;
  }

  getConfig(): Config {
    return { ...this.config };
  }

  loadState(): State {
    const savedState = GM_getValue('avatarState');
    return savedState ? { ...defaultState, ...savedState } : defaultState;
  }

  saveState(newState: any): boolean {
    this.state = { ...this.state, ...newState };
    if (this.state.updateHistory && this.state.updateHistory.length > 100) {
      this.state.updateHistory = this.state.updateHistory.slice(-100);
    }
    GM_setValue('avatarState', this.state);
    return true;
  }

  recordSuccess(imageUrl = ''): State {
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

    this.saveState(newState);
    return this.state;
  }

  recordError(error: any): State {
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

    this.saveState(newState);
    return this.state;
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

  hasUpdatedToday() {
    const state: any = GM_getValue('avatarState', {});
    if (!state.lastUpdate) return false;

    const last = new Date(state.lastUpdate);
    const today = new Date();

    return last.getDate() === today.getDate() &&
      last.getMonth() === today.getMonth() &&
      last.getFullYear() === today.getFullYear();
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

  listStorage(): string[] {
    return GM_listValues();
  }

  clearAllData(): boolean {
    GM_deleteValue('avatarConfig');
    GM_deleteValue('avatarState');
    this.config = DEFAULT_CONFIG;
    this.state = this.loadState();
    return true;
  }
}
