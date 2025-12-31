import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@/store';

/**
 * 头像自动更新+失败重试逻辑
 * - 到达下次预定更新时间时自动更新
 * - 失败时根据配置自动重试，最多 retryCount 次，每次间隔 retryInterval
 */
export function AvatarUpdateScheduler() {
  const { config, stats, updateAvatar } = useStore();
  const retryRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!config?.autoStart || typeof updateAvatar !== 'function') return;

    const now = Date.now();
    const nextScheduled = stats?.nextScheduledUpdate || 0;

    // 到达下次预定更新时间时自动更新
    if (now >= nextScheduled) {
      retryRef.current = 0;
      updateAvatarWithRetry();
    }

    // 清理定时器
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
    // eslint-disable-next-line
  }, [config?.autoStart, stats?.nextScheduledUpdate]);

  // 更新+重试逻辑
  function updateAvatarWithRetry() {
    updateAvatar()
      .catch(() => {
        if (config.enableRetry && retryRef.current < config.retryCount) {
          retryRef.current += 1;
          retryTimerRef.current = setTimeout(updateAvatarWithRetry, config.retryInterval);
        }
      });
  }

  return null;
}
