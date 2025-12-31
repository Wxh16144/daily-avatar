
import type { Config } from '@/types/config';
import type { State } from '@/types/state';

import { type IConfigStorage, BrowserConfigManager } from '@/lib/configManager';
import { TampermonkeyConfigManager } from './Tampermonkey';

export class HybridConfigManager implements IConfigStorage<Config, State> {
  browser: BrowserConfigManager;
  tampermonkey: TampermonkeyConfigManager;
  primary: 'browser' | 'tampermonkey';

  constructor(
    dbName = 'daily-avatar',
    primary: 'browser' | 'tampermonkey' = 'tampermonkey'
  ) {
    this.browser = new BrowserConfigManager(dbName);
    this.tampermonkey = new TampermonkeyConfigManager();
    this.primary = primary;
  }

  private get main() {
    return this.primary === 'browser' ? this.browser : this.tampermonkey;
  }
  private get backup() {
    return this.primary === 'browser' ? this.tampermonkey : this.browser;
  }

  get config() {
    return this.main.config;
  }
  get state() {
    return this.main.state;
  }

  // 读取配置：优先主存储，自动同步到另一端
  async loadConfig(): Promise<Config> {
    const config = await this.main.loadConfig();
    await this.backup.saveConfig(config);
    return config;
  }

  async saveConfig(newConfig: Partial<Config>): Promise<boolean> {
    const res1 = await this.browser.saveConfig(newConfig);
    const res2 = this.tampermonkey.saveConfig(newConfig);
    return !!(res1 && res2);
  }

  async resetConfig(): Promise<boolean> {
    const res1 = await this.browser.resetConfig();
    const res2 = this.tampermonkey.resetConfig();
    return !!(res1 && res2);
  }

  getConfig(): Config {
    return this.main.getConfig();
  }

  async loadState(): Promise<State> {
    const state = await this.main.loadState();
    await this.backup.saveState(state);
    return state;
  }

  async saveState(newState: Partial<State>): Promise<boolean> {
    const res1 = await this.browser.saveState(newState);
    const res2 = this.tampermonkey.saveState(newState);
    return !!(res1 && res2);
  }

  async listStorage(): Promise<string[]> {
    const list1 = await this.browser.listStorage();
    const list2 = this.tampermonkey.listStorage();
    return Array.from(new Set([...(list1 || []), ...(list2 || [])]));
  }

  async clearAllData(): Promise<boolean> {
    const res1 = await this.browser.clearAllData();
    const res2 = this.tampermonkey.clearAllData();
    return !!(res1 && res2);
  }

  async recordSuccess() {
    return Promise.all([
      this.browser.recordSuccess(),
      this.tampermonkey.recordSuccess(),
    ]).then(() => this.main.getState());
  }

  async recordError(error: Error | { message: string }) {
    return Promise.all([
      this.browser.recordError(error),
      this.tampermonkey.recordError(error),
    ]).then(() => this.main.getState());
  }

  getState() {
    return this.main.getState();
  }

  hasUpdatedToday() {
    return this.main.hasUpdatedToday();
  }
}

export default HybridConfigManager;