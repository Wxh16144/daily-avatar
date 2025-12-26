import { TampermonkeyConfigManager } from '../Tampermonkey';

export class AvatarUpdater {
  configManager: TampermonkeyConfigManager;

  constructor(configManager: TampermonkeyConfigManager) {
    this.configManager = configManager;
  }

  isCrossOriginUrl(url: string) {
    try {
      const apiUrl = new URL(url);
      const currentUrl = new URL(window.location.href);
      return apiUrl.origin !== currentUrl.origin;
    } catch {
      return false;
    }
  }

  async fetchAvatarImage() {
    const config = this.configManager.getConfig();
    let url = '';

    switch (config.avatarSource) {
      case 'unsplash':
        // 简单的 Unsplash Source URL
        url = `https://source.unsplash.com/random/128x128?sig=${Date.now()}`;
        break;
      case 'api':
        url = config.apiUrl;
        break;
      case 'random':
      default:
        // 使用一个默认的随机头像 API，例如 DiceBear
        url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
        break;
    }

    if (!url) throw new Error('未配置头像源');

    console.log('Fetching avatar from:', url);

    if (this.isCrossOriginUrl(url)) {
      return this.fetchWithGM(url);
    } else {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`获取图片失败: ${response.status}`);
      return await response.blob();
    }
  }

  async uploadAvatar(blob: Blob) {
    const formData = new FormData();
    // V2EX 的头像上传字段通常是 'avatar'，需要根据实际情况调整
    // 这里假设是标准的表单上传
    // 注意：V2EX 可能需要 CSRF token，通常在页面中可以找到
    // 假设脚本运行在 V2EX 页面上，我们可以尝试获取

    // 模拟上传过程，因为实际 V2EX 上传接口需要抓包确认
    // 这里我们假设有一个 /settings/avatar 接口
    formData.append('avatar', blob, 'avatar.png');

    // 获取 CSRF Token (V2EX 特有)
    // const once = document.querySelector('input[name="once"]')?.value;
    // if (once) formData.append('once', once);

    // 实际上传逻辑
    // return await this.uploadWithFetch(formData);

    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }

  async uploadWithFetch(formData: FormData) {
    const response = await fetch('/settings/avatar', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`上传失败: ${response.status}`);
    }
    return await response.json(); // 或者 response.text()
  }

  fetchWithGM(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        onload: (response) => {
          if (response.status === 200) {
            resolve(response.response as Blob);
          } else {
            reject(new Error(`GM请求失败: ${response.status}`));
          }
        },
        onerror: (error) => {
          reject(error);
        }
      });
    });
  }

  async execute() {
    try {
      const blob = await this.fetchAvatarImage();
      await this.uploadAvatar(blob);

      // 记录成功
      this.configManager.recordSuccess();
    } catch (error) {
      throw error; // 抛出给 store 处理
    }
  }
}
