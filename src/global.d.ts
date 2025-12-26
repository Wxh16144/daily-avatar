import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { useStore } from '@/store';

declare global {
  interface Window {

    daily_avatar_UI: {
      init: (configManager: BaseConfigManager, mountPointId?: string) => {
        unmount: () => void;
      };
      store: useStore;
    };
  }
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}

export { };