import type { AppStore } from '@/store';
import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { UseBoundStore, StoreApi } from 'zustand';

declare global {
  interface Window {

    daily_avatar_UI: {
      init: (configManager: BaseConfigManager, mountPointId?: string) => {
        unmount: () => void;
      };
      store: UseBoundStore<StoreApi<AppStore>>;
    };
  }
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}

export { };