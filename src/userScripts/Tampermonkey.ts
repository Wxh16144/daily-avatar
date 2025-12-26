import { DEFAULT_CONFIG } from '@/constants/defaultConf';
import { BaseConfigManager } from '@/lib/configManager/Base';
import { defaultState } from '@/constants/defaultState';
import type { Config } from "@/types/config";
import type { State } from "@/types/state";

export class TampermonkeyConfigManager extends BaseConfigManager<Config, State> {
  config: Config;
  state: State;
  constructor() {
    super();
    this.config = this.loadConfig();
    this.state = this.loadState();
  }
  loadConfig(): Config {
    const savedConfig = GM_getValue('avatarConfig');
    const config = savedConfig ? { ...DEFAULT_CONFIG, ...savedConfig } : { ...DEFAULT_CONFIG };
    if (!savedConfig) {
      GM_setValue('avatarConfig', config);
    }
    this.config = config;
    return config;
  }

  saveConfig(newConfig: Partial<Config>): boolean {
    this.config = { ...this.config, ...newConfig };
    GM_setValue('avatarConfig', this.config);
    return true;
  }

  resetConfig(): boolean {
    const config = { ...DEFAULT_CONFIG };
    GM_setValue('avatarConfig', config);
    this.config = config;
    return true;
  }

  getConfig(): Config {
    return { ...this.config };
  }
  loadState(): State {
    const savedState = GM_getValue('avatarState');
    const state = savedState ? { ...defaultState, ...savedState } : defaultState;
    this.state = state;
    return state;
  }

  saveState(newState: Partial<State>): boolean {
    this.state = { ...this.state, ...newState };
    GM_setValue('avatarState', this.state);
    return true;
  }

  listStorage(): string[] {
    return GM_listValues();
  }

  clearAllData(): boolean {
    GM_deleteValue('avatarConfig');
    GM_deleteValue('avatarState');
    this.config = { ...DEFAULT_CONFIG };
    this.state = this.loadState();
    return true;
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
}
