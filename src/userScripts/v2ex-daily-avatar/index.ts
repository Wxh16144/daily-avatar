import { TampermonkeyConfigManager } from '../Tampermonkey';
import { AvatarUpdater } from './AvatarUpdater';

// 等待 UI 库加载
const waitForUI = () => {
  return new Promise<void>((resolve) => {
    if (window.daily_avatar_UI) {
      resolve();
    } else {
      const check = setInterval(() => {
        if (window.daily_avatar_UI) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    }
  });
};

async function main() {
  await waitForUI();

  const configManager = new TampermonkeyConfigManager();
  const updater = new AvatarUpdater(configManager);

  // 初始化 UI
  const { init, store } = window.daily_avatar_UI;
  init(configManager);

  // 注册更新处理函数
  store.getState().registerUpdateHandler(async () => {
    await updater.execute();
  });

  console.log('V2EX Daily Avatar initialized');
}

main();
