import type { AppActions } from '@/store/actions';

declare global {
  interface Window {
    daily_avatar_UI: {
      init: (configManager: any, mountPointId?: string) => {
        unmount: () => void;
      };
      actions: Omit<AppActions, 'init'>;
    };
  }
}

export { };