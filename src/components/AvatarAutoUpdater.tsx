import { useEffect } from 'preact/hooks';
import { useStore } from '@/store';

/**
 * 头像自动更新触发器, 设置了 `autoStart` 后生效
 */
export function AvatarAutoUpdater() {
  const { config, stats, updateAvatar } = useStore();

  useEffect(() => {
    if (!config?.autoStart || typeof updateAvatar !== 'function') return;

    // 判断是否需要自动更新
    const now = Date.now();
    const nextScheduled = stats?.nextScheduledUpdate || 0;

    // 仅到达下次预定更新时间时自动更新
    if (now >= nextScheduled) {
      console.log('[AvatarAutoUpdater] Triggering automatic avatar update...');
      updateAvatar();
    }
  }, [config?.autoStart, stats?.nextScheduledUpdate]);

  return null;
}
