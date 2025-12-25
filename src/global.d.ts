
declare global {
  interface Window {
    daily_avatar_UI: {
      init: (configManager: any) => {
        unmount: () => void;
      };
    };
  }
}

export { };