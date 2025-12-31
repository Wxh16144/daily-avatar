import type { BaseConfigManager } from '@/lib/configManager';
import type { Config } from '@/types/config';
import type { State, UpdateLog } from '@/types/state';
import { DEFAULT_APP_CONFIG } from '@/constants/appConfig';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface UIState {
  title: string;
  showSettings: boolean;
  showPanel: boolean;
  isUpdating: boolean;
  notifications: Notification[];
}

export interface AppState {
  configManager: BaseConfigManager | null;
  config: Config;
  stats: State;
  ui: UIState;
  updateHandler: (() => Promise<void>) | null;
  history: UpdateLog[];
}

export const initialState: AppState = {
  configManager: null,
  config: {} as Config,
  stats: {} as State,
  ui: {
    title: DEFAULT_APP_CONFIG.title,
    showSettings: false,
    showPanel: false,
    isUpdating: false,
    notifications: [],
  },
  updateHandler: null,
  history: [],
};
