import { openDB, type DBSchema } from 'idb';
import { DEFAULT_CONFIG } from '@/constants/defaultConf';
import type { Config } from '@/types/config';
import type { State } from '@/types/state';
import { BaseConfigManager } from './Base';

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

export class BrowserConfigManager extends BaseConfigManager<Config, State> {
  config: Config;
  state: State;

  constructor() {
    super();
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

  protected getDefaultState(): State {
    return {
      lastUpdate: 0,
      lastResult: null,
      lastErrorMessage: null,
      isUpdating: false,
      nextScheduledUpdate: 0,
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

  async saveState(newState: Partial<State>): Promise<boolean> {
    this.state = { ...this.state, ...newState };
    const db = await dbPromise;
    await db.put('state-store', this.state, 'avatarState');
    return true;
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
