import { useStore } from '@/store';

export function ProgressBar() {
  const { config, stats } = useStore();

  if (stats.timeUntilNextUpdate <= 0) return null;

  return (
    <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
      <div class="flex justify-between text-xs text-gray-500 mb-2">
        <span>等待下次更新</span>
        <span class="font-medium text-blue-600">{Math.round((1 - stats.timeUntilNextUpdate / config.updateInterval) * 100)}%</span>
      </div>
      <div class="w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
        <div
          class="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          style={{ width: `${(1 - stats.timeUntilNextUpdate / config.updateInterval) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
