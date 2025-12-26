import { h, render } from 'preact'
import type { BaseConfigManager } from '@/lib/configManager/Base.ts';
import styles from './index.css?inline'
import { App } from './app.tsx'
import { useStore } from '@/store';

export function init(
  configManager: BaseConfigManager,
  mountPointId = 'daily-avatar-ui'
) {
  // 初始化 store
  useStore.getState().init(configManager);

  // 创建宿主元素 (Shadow Host)
  let container = document.getElementById(mountPointId);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', mountPointId);
    container.setAttribute('data-source', 'https://github.com');
    // 设置宿主元素样式，确保它不会影响页面布局，但允许内部 fixed 元素显示
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'visible';
    container.style.zIndex = '2147483647'; // Max z-index
    document.body.appendChild(container);
  }

  // 创建 Shadow Root
  const shadowRoot = container.shadowRoot || container.attachShadow({ mode: 'open' });

  // 注入样式
  let styleSheet = shadowRoot.querySelector('style');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    shadowRoot.appendChild(styleSheet);
  }
  styleSheet.textContent = styles;

  // 创建应用挂载点
  let mountPoint = shadowRoot.getElementById('root');
  if (!mountPoint) {
    mountPoint = document.createElement('div');
    mountPoint.id = 'root';
    shadowRoot.appendChild(mountPoint);
  }

  // 渲染应用
  render(h(App, {}), mountPoint);

  return {
    unmount: () => {
      if (mountPoint) {
        render(null, mountPoint);
      }
      if (container) {
        container.remove();
      }
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