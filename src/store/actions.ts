
import type { StateCreator } from 'zustand/vanilla';
import type { AppStore } from '.';
import type { Config } from '@/types/config';
import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { NotificationType } from './initialState';

export interface AppActions {
  init: (configManager: BaseConfigManager) => Promise<void>;
  updateConfig: (key: keyof Config, value: any) => void;
  saveConfig: () => Promise<void>;
  resetConfig: () => Promise<void>;

  toggleSettings: (show?: boolean) => void;
  togglePanel: (show: boolean) => void;

  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
  hideNotification: (id: string) => void;

  registerUpdateHandler: (handler: () => Promise<void>) => void;

  refreshStats: () => void;
  updateAvatar: () => Promise<void>;
}

export const createActions: StateCreator<
  AppStore,
  [['zustand/devtools', never]],
  [],
  AppActions
> = (set, get) => ({
  init: async (configManager) => {
    const config = await configManager.loadConfig();
    await configManager.loadState(); // Ensure state is loaded
    const stats = configManager.getStats();
    set({ configManager, config, stats });
  },

  updateConfig: (key, value) => {
    set((state) => ({
      config: { ...state.config, [key]: value }
    }));
  },

  saveConfig: async () => {
    const { configManager, config } = get();
    if (configManager) {
      await configManager.saveConfig(config);
    }
  },

  resetConfig: async () => {
    const { configManager } = get();
    if (configManager) {
      await configManager.resetConfig();
      const config = configManager.getConfig();
      set({ config });
    }
  },

  toggleSettings: (show) => set(
    (state) => ({
      ui: {
        ...state.ui,
        showSettings: show ?? !state.ui.showSettings
      }
    })
  ),


  togglePanel: (show) => set(
    (state) => ({
      ui: {
        ...state.ui,
        showPanel: show ?? !state.ui.showPanel
      }
    })
  ),

  showNotification: (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 9);
    set((state) => ({
      ui: {
        ...state.ui,
        notifications: [...state.ui.notifications, { id, type, message, duration }]
      }
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().hideNotification(id);
      }, duration);
    }
  },

  hideNotification: (id) => {
    set((state) => ({
      ui: {
        ...state.ui,
        notifications: state.ui.notifications.filter((n) => n.id !== id)
      }
    }));
  },

  refreshStats: () => {
    const { configManager } = get();
    if (configManager) {
      set({ stats: configManager.getStats() });
    }
  },

  updateAvatar: async () => {
    const { configManager, updateHandler } = get();
    if (!configManager || !updateHandler) return;

    set((state) => ({ ui: { ...state.ui, isUpdating: true } }));
    try {
      // implement actual update logic if available
      console.log('[updateAvatar] Starting avatar update...');
      await get().updateHandler?.();
      console.log('[updateAvatar] Avatar update completed.');
      set({ stats: configManager.getStats() });
    } catch (error) {
      console.error('Update failed:', error);
      const message = error instanceof Error ? error.message : String(error);
      get().showNotification(`失败: ${message}`, 'error', 5000);
    } finally {
      set((state) => ({ ui: { ...state.ui, isUpdating: false } }));
    }
  },

  registerUpdateHandler: (handler) => {
    set({ updateHandler: handler });
  },
})