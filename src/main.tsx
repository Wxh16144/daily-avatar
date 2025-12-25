import { h, render } from 'preact'
import type { BaseConfigManager } from '@/lib/configManager/Base.ts';
import './index.css'
import { App } from './app.tsx'
import { useStore } from '@/store';

export function init(
  configManager: BaseConfigManager,
  mountPointId = 'daily-avatar-ui'
) {
  // 初始化 store
  useStore.getState().init(configManager);

  // 创建挂载点
  let mountPoint = document.getElementById(mountPointId);
  if (!mountPoint) {
    mountPoint = document.createElement('div');
    mountPoint.setAttribute('id', mountPointId);
    mountPoint.setAttribute('data-source', 'https://github.com');
    document.body.appendChild(mountPoint);
  }

  // 渲染应用
  render(h(App, {}), mountPoint);

  return {
    unmount: () => {
      render(null, mountPoint);
      mountPoint.remove();
    }
  };
}

// 导出给油猴脚本使用
if (typeof window !== 'undefined') {
  window.daily_avatar_UI = {
    init,
    store: useStore,
  };
}