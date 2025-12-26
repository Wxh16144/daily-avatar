import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { Config } from '@/types/config';
import type { State } from '@/types/state';

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
}

export const initialState: AppState = {
  configManager: null,
  config: {} as Config,
  stats: {} as State,
  ui: {
    title: 'Daily Avatar',
    showSettings: false,
    showPanel: false,
    isUpdating: false,
    notifications: [],
  },
  updateHandler: null,
};
