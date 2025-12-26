# Daily Avatar UI

这是一个自动更换头像脚本设计的 UI 界面库。它提供了一套现代化的、样式隔离的配置面板和状态监控组件。

> **⚠️ 注意**：本项目仅包含 UI 界面、配置管理和状态流转逻辑。实际的头像获取（Fetch）与上传（Upload）功能需要在宿主脚本（如 Tampermonkey 脚本）中实现并注册到此 UI 中。

## ✨ 特性

- **🛡️ 样式隔离**：采用 Shadow DOM 技术封装，确保 UI 样式（Tailwind CSS）完全独立，既不污染宿主网页，也不受宿主网页样式干扰。
- **🎨 现代化界面**：基于 Preact + Tailwind CSS v4 构建，提供简洁、美观的配置面板和状态悬浮窗。
- **⚙️ 完整配置**：内置设置面板，支持调节更新频率、切换头像来源（Unsplash/自定义API/随机）、管理通知偏好。
- **📊 状态监控**：实时展示更新成功率、历史记录、下次更新倒计时等统计信息。

## 🚀 集成指南

如果你是 UserScript 开发者，可以通过以下步骤将此 UI 集成到你的脚本中。

### 1. 引入资源

在你的 UserScript Metadata 中引入构建好的 IIFE 资源文件：

```javascript
// @require TODO: 替换为实际的 UI 库 URL
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

## 🛠️ 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

这将启动 Vite 服务器，你可以在浏览器中预览 UI 组件。

### 构建

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录：
*   `index.iife.js`: 包含完整 UI 和样式的 IIFE 包，适合 UserScript 引用。
*   `index.js`: ESM 格式包。

## 🏗️ 技术栈

*   **UI 框架**: [Preact](https://preactjs.com/) (轻量级 React 替代方案)
*   **状态管理**: [Zustand](https://github.com/pmndrs/zustand) (Vanilla store + Custom hooks)
*   **样式引擎**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **构建工具**: [Vite](https://vitejs.dev/) & [tsdown](https://github.com/sxzz/tsdown)
*   **隔离方案**: Native Shadow DOM

## 📄 License

MIT
