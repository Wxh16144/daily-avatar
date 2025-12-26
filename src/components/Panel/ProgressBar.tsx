import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@/store';
import { formatDuration } from '@/utils/format';

export function ProgressBar() {
  const { config, stats } = useStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUntilNextUpdate = stats.nextScheduledUpdate - now;

  if (timeUntilNextUpdate <= 0) return null;

  const progress = Math.min(
    100,
    Math.round((1 - timeUntilNextUpdate / config.updateInterval) * 100)
  );

  return (
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100" style={{ border: '1px solid #dbeafe' }}>
      <div class="flex justify-between items-center text-xs mb-2">
        <span class="text-gray-600 font-medium">下次更新倒计时</span>
        <span class="text-blue-600 font-semibold">{formatDuration(timeUntilNextUpdate, true)}</span>
      </div>
      <div class="w-full bg-white/80 rounded-full h-2 overflow-hidden shadow-inner" style={{ boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}>
        <div
          class="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}
        ></div>
      </div>
    </div>
  );
}
