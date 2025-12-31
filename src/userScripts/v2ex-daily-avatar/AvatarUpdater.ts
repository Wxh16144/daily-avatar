import type { IConfigStorage } from '@/lib/configManager';
import type { State } from '@/types/state';
import type { Config } from '@/types/config';

export class AvatarUpdater {
  configManager: IConfigStorage<Config, State>;

  constructor(configManager: IConfigStorage<Config, State>) {
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

  base64ToBlob(base64: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async fetchAvatarImage() {
    const config = this.configManager.getConfig();
    let url = '';

    if (config.avatarSource === 'weekly-mood') {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[new Date().getDay()];
      const moodAvatar = await this.configManager.getMoodAvatar(dayName);
      if (moodAvatar) {
        return this.base64ToBlob(moodAvatar);
      }
      // Fallback if no custom avatar set
      // Using a consistent seed for the day
      url = `https://api.dicebear.com/9.x/initials/png?seed=${dayName}&size=256`;
    } else if (config.avatarSource === 'api') {
      url = config.apiUrl;
    } else {
      // https://www.dicebear.com/styles/croodles-neutral/
      const qs = new URLSearchParams();
      qs.append('seed', Date.now().toString());
      qs.append('size', '256');
      url = `https://api.dicebear.com/9.x/croodles-neutral/png?${qs.toString()}`;
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
    formData.append('avatar', blob, 'avatar.png');

    const once = await this.fetchOnceToken();

    if (!once) throw new Error('未能获取 once，可能未登录或页面结构变更');
    formData.append('once', once);

    return await this.uploadWithFetch(formData);
  }

  /**
   * 请求用户设置页面并解析 once
   */
  fetchOnceToken(): Promise<string | null> {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.v2ex.com/settings',
        onload: (response) => {
          if (response.status === 200 && response.responseText) {
            const html = response.responseText;
            const dom = $(html);
            const once = dom.find('input[name="once"]').val();
            resolve(once ? String(once) : null);
          } else {
            resolve(null);
          }
        },
        onerror: () => resolve(null)
      });
    });
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
    const html = await response.text();
    if (html.includes('新头像设置成功')) {
      return { success: true };
    }
    throw new Error('可能上传失败，未检测到“新头像设置成功”提示');
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
