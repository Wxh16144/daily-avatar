import { useEffect } from 'preact/hooks';
import { useStore } from '@/store';

export function DataRefresher() {
  const { refreshStats } = useStore();

  useEffect(() => {
    // 初始加载时立即刷新一次
    refreshStats();

    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // 30秒更新一次

    return () => clearInterval(interval);
  }, [refreshStats]);

  return null; // 不渲染任何 UI
}
