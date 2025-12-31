import { ConfigManager } from '../HybridConfigManager';
import { AvatarUpdater } from './AvatarUpdater';
import { APP_META } from '@/constants/meta';

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

  const configManager = new ConfigManager('v2ex-daily-avatar');
  const updater = new AvatarUpdater(configManager);

  // 初始化 UI
  const { init, store } = window.daily_avatar_UI;
  init(configManager, {
    title: 'V2EX Daily Avatar'
  });

  // 注册更新处理函数
  store
    .getState()
    .registerUpdateHandler(updater.execute.bind(updater));

  // 注册菜单命令
  try {
    GM_registerMenuCommand('⚙️ 打开设置', () => {
      store.getState().togglePanel(false);
      store.getState().toggleSettings(true);
    });

    GM_registerMenuCommand('📊 查看状态', () => {
      store.getState().toggleSettings(false);
      store.getState().togglePanel(true);
    });

    GM_registerMenuCommand('🔄 立即更新', () => {
      store.getState().updateAvatar();
    });

    GM_registerMenuCommand('🗑️ 重置所有数据', () => {
      if (confirm('确定要重置所有数据吗？这将清除所有设置和统计信息。')) {
        configManager.clearAllData();
        store.getState().showNotification('数据已重置', 'warning');
        // 刷新 store 中的配置
        store.getState().init(configManager);
      }
    });
  } catch (e) {
    console.log('菜单命令注册失败（某些管理器可能不支持）:', e);
  }

  console.log(`${APP_META.name} initialized`);
}

main();
