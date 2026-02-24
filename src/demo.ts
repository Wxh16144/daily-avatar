import { BrowserConfigManager } from './lib/configManager/Browser';

export async function setupDemo(configManager: BrowserConfigManager) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Wait for UI to be initialized
  const waitForUI = () => new Promise<void>((resolve) => {
    if (window.daily_avatar_UI) return resolve();
    const timer = setInterval(() => {
      if (window.daily_avatar_UI) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });

  await waitForUI();

  const { store } = window.daily_avatar_UI;
  store.getState().registerUpdateHandler(async () => {
    // 1. Determine if this update will succeed or fail (Random)
    const shouldFail = Math.random() > 0.5;

    // [2000, 5000] ms 随机延迟
    const delay = Math.floor(Math.random() * 3000) + 2000;
    console.log(`Waiting for ${delay} ms before recording update result...`);
    await sleep(delay);

    if (shouldFail) {
      console.error('%cUpdate failed!', 'color: red;');
      throw new Error('Simulated update failure');
    }

    // If success, then process image and update DOM

    // 打印当前设置
    const config = store.getState().config;
    console.log('%cCurrent Configuration:', 'color: purple; font-weight: bold;', config);

    // 模拟获取头像逻辑
    let avatarUrl = '';
    if (config.avatarSource === 'weekly-mood') {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[new Date().getDay()];
      const moodAvatar = await configManager.getMoodAvatar(dayName);
      if (moodAvatar) {
        avatarUrl = moodAvatar;
      } else {
        // Use dicebear initials as fallback for weekly mood if not set
        avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${dayName}&size=256`;
      }
    } else if (config.avatarSource === 'api') {
      avatarUrl = configManager.getResolver().getFinalApiUrl();
    } else {
      const qs = new URLSearchParams();
      qs.append('seed', String(Date.now()));
      qs.append('size', '256');
      avatarUrl = `https://api.dicebear.com/9.x/croodles-neutral/svg?${qs.toString()}`;
    }

    // 显示头像
    let img = document.getElementById('demo-avatar-preview') as HTMLImageElement;
    if (!img) {
      img = document.createElement('img');
      img.id = 'demo-avatar-preview';
      img.style.width = '200px';
      img.style.height = '200px';
      img.style.border = '2px solid #ccc';
      img.style.borderRadius = '10px';
      img.style.margin = '20px';
      img.style.display = 'block';
      document.body.appendChild(img);
    }
    img.src = avatarUrl;

    console.log('%cUpdate succeeded!', 'color: blue;');
  });
}
