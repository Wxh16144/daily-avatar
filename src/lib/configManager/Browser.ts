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
  'mood-store': {
    key: string;
    value: string;
  };
}


function createDBPromise(dbName: string) {
  return openDB<AvatarDB>(dbName, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('config-store')) {
        db.createObjectStore('config-store');
      }
      if (!db.objectStoreNames.contains('state-store')) {
        db.createObjectStore('state-store');
      }
      if (!db.objectStoreNames.contains('mood-store')) {
        db.createObjectStore('mood-store');
      }
    },
  });
}

export class BrowserConfigManager extends BaseConfigManager<Config, State> {
  config: Config;
  state: State;
  dbName: string;
  dbPromise: ReturnType<typeof createDBPromise>;

  constructor(dbName = 'daily-avatar') {
    super();
    this.dbName = dbName;
    this.dbPromise = createDBPromise(this.dbName);
    // 初始化默认值，避免在异步加载完成前为 undefined
    this.config = { ...DEFAULT_CONFIG };
    this.state = this.getDefaultState();

    // 触发异步加载
    this.loadConfig();
    this.loadState();
  }

  async loadConfig(): Promise<Config> {
    const db = await this.dbPromise;
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
    const db = await this.dbPromise;
    await db.put('config-store', this.config, 'avatarConfig');
    return true;
  }

  async resetConfig(): Promise<boolean> {
    const db = await this.dbPromise;
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
      history: [],
    };
  }

  async listStorage(): Promise<string[]> {
    return ['avatarConfig', 'avatarState'];
  }

  async loadState(): Promise<State> {
    const defaultState = this.getDefaultState();
    const db = await this.dbPromise;
    const savedState = await db.get('state-store', 'avatarState');

    const state = savedState ? { ...defaultState, ...savedState } : defaultState;
    this.state = state;
    return state;
  }

  async saveState(newState: Partial<State>): Promise<boolean> {
    this.state = { ...this.state, ...newState };
    const db = await this.dbPromise;
    await db.put('state-store', this.state, 'avatarState');
    return true;
  }

  async clearAllData(): Promise<boolean> {
    const db = await this.dbPromise;
    await db.clear('config-store');
    await db.clear('state-store');
    await db.clear('mood-store');
    this.config = { ...DEFAULT_CONFIG };
    this.state = this.getDefaultState();
    return true;
  }

  async getMoodAvatar(day: string): Promise<string | null> {
    const db = await this.dbPromise;
    const avatar = await db.get('mood-store', `day-${day}`);
    return avatar || null;
  }

  async saveMoodAvatar(day: string, base64: string): Promise<boolean> {
    const db = await this.dbPromise;
    await db.put('mood-store', base64, `day-${day}`);
    return true;
  }
}
