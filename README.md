# Daily Avatar UI

这是一个自动更换头像脚本设计的 UI 界面库。它提供了配置面板和状态监控组件。

## 🚀 集成指南

如果你是 UserScript 开发者，可以通过以下步骤将此 UI 集成到你的脚本中。

### 1. 引入资源

在你的 UserScript Metadata 中引入构建好的 IIFE 资源文件：

```javascript
// @require https://unpkg.com/@wuxh/daily-avatar@<version>
```

### 2. 初始化与注册

UI 库加载后会在全局暴露 `window.daily_avatar_UI` 对象。你需要初始化它，并注册实际的更新逻辑。

```javascript
(function() {
    'use strict';

    // 1. 等待 UI 库加载
    const waitForUI = () => new Promise(resolve => {
        if (window.daily_avatar_UI) return resolve();
        const timer = setInterval(() => {
            if (window.daily_avatar_UI) {
                clearInterval(timer);
                resolve();
            }
        }, 50);
    });

    async function main() {
        await waitForUI();
        
        // 2. 准备配置管理器
        const configManager = new TampermonkeyConfigManager(); 
        
        const { init, store } = window.daily_avatar_UI;
        
        // 3. 初始化 UI
        // configManager 用于持久化存储配置和状态
        init(configManager);

        // 4. 注册核心更新逻辑 (Handler)
        // 当用户点击"立即更新"或自动触发时，UI 会调用此 Handler
        store.getState().registerUpdateHandler(async () => {
            console.log('UI 请求更新头像...');
            
            // --- 在这里实现你的业务逻辑 ---
            // 1. 获取头像数据
            // const imageBlob = await fetchAvatarImage();
            
            // 2. 上传到目标网站
            // await uploadAvatar(imageBlob);
            
            // 3. 记录结果
            // 成功时：configManager.recordSuccess()
            // 失败时：抛出 Error，UI 会自动捕获并显示错误通知
        });
    }

    main();
})();
```

## ⚙️ Configuration (AppConfig)

`init` 函数的第二个参数接受一个 `AppConfig` 对象，用于配置 UI 的基本行为。

定义文件: [src/types/appConfig.ts](./src/types/appConfig.ts)

```typescript
interface AppConfig {
  /**
   * UI 面板的标题
   * @default 'Daily Avatar'
   */
  title: string;
}
```

## 📚 Store Actions

通过 `window.daily_avatar_UI.store.getState()` 可以获取到所有的 Actions。

定义文件: [src/store/actions.ts](./src/store/actions.ts)

常用 Actions:

- `registerUpdateHandler(handler: () => Promise<void>)`: 注册更新头像的核心逻辑。
- `showNotification(message: string, type?: 'success' | 'error' | 'info', duration?: number)`: 显示通知。
- `togglePanel(show?: boolean)`: 切换面板的显示/隐藏。
- `toggleSettings(show?: boolean)`: 切换设置界面的显示/隐藏。

## 🐒 开箱即用的用户脚本

| 脚本 | 说明 | 安装 |
| --- | --- | --- |
| V2EX Daily Avatar | 每天自动更换 V2EX 头像 | [安装](https://unpkg.com/@wuxh/daily-avatar/userscripts/v2ex-daily-avatar.user.js) |
| V2EX / linux.do / 知乎 Avatar Mask | 把页面上的用户头像替换成丑头像（仅显示层） | [安装](https://unpkg.com/@wuxh/daily-avatar/userscripts/v2ex-avatar-mask.user.js) |

源码分别位于 [src/userScripts/v2ex-daily-avatar](./src/userScripts/v2ex-daily-avatar) 与
[src/userScripts/v2ex-avatar-mask](./src/userScripts/v2ex-avatar-mask)。

## 📄 License

[MIT License](./LICENSE)
