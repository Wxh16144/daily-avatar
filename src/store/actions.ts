
import type { StateCreator } from 'zustand/vanilla';
import type { AppStore } from '.';
import type { Config } from '@/types/config';
import type { BaseConfigManager } from '@/lib/configManager/Base';

export interface AppActions {
  init: (configManager: BaseConfigManager) => Promise<void>;
  updateConfig: (key: keyof Config, value: any) => void;
  saveConfig: () => Promise<void>;
  resetConfig: () => Promise<void>;

  toggleSettings: (show: boolean) => void;
  togglePanel: (show: boolean) => void;

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

  toggleSettings: (show) => set((state) => ({ ui: { ...state.ui, showSettings: show } })),
  togglePanel: (show) => set((state) => ({ ui: { ...state.ui, showPanel: show } })),

  refreshStats: () => {
    const { configManager } = get();
    if (configManager) {
      set({ stats: configManager.getStats() });
    }
  },

  updateAvatar: async () => {
    const { configManager } = get();
    if (!configManager) return;

    set((state) => ({ ui: { ...state.ui, isUpdating: true } }));
    try {
      // implement actual update logic if available
      console.log('[updateAvatar] Starting avatar update...');
      set({ stats: configManager.getStats() });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      set((state) => ({ ui: { ...state.ui, isUpdating: false } }));
    }
  },
})