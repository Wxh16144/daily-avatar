import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { Config } from '@/types/config';

interface UIState {
  showSettings: boolean;
  showPanel: boolean;
  isUpdating: boolean;
}

export interface AppState {
  configManager: BaseConfigManager | null;
  config: Config;
  stats: any;
  ui: UIState;
}

export const initialState: AppState = {
  configManager: null,
  config: {} as Config,
  stats: {},
  ui: {
    showSettings: false,
    showPanel: false,
    isUpdating: false,
  },
};