import type { BaseConfigManager } from '@/lib/configManager/Base';
import type { useStore } from '@/store';
import type { AppConfig } from '@/types/appConfig';

declare global {
  interface Window {
    daily_avatar_UI: {
      init: (
        configManager: BaseConfigManager,
        config?: Partial<AppConfig>,
        mountPointId?: string,
      ) => {
        unmount: () => void;
      };
      store: typeof useStore;
    };
  }
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}

export { };