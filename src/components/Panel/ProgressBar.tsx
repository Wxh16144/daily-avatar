import { useStore } from '@/store';

export function ProgressBar() {
  const { config, stats } = useStore();

  if (!stats.timeUntilNextUpdate || stats.timeUntilNextUpdate <= 0) return null;

  const progress = Math.min(
    100,
    Math.round((1 - stats.timeUntilNextUpdate / config.updateInterval) * 100)
  );

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
      <div class="flex justify-between items-center text-xs mb-2">
        <span class="text-gray-600 font-medium">下次更新倒计时</span>
        <span class="text-blue-600 font-semibold">{formatTimeRemaining(stats.timeUntilNextUpdate)}</span>
      </div>
      <div class="w-full bg-white/80 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
