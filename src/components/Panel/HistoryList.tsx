import { useState } from 'preact/hooks';
import { useStore } from '@/store';
import { formatTime } from '@/utils/format';

export function HistoryList() {
  const { stats } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!stats.history || stats.history.length === 0) {
    return null;
  }

  return (
    <div class="border-t border-gray-100 pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        class="flex items-center justify-between w-full text-xs text-gray-500 hover:text-gray-700 py-1"
      >
        <span class="font-medium">最近更新记录</span>
        <svg
          class={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div class="mt-2 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {stats.history.map((log, index) => (
            <div key={index} class="flex items-start space-x-2 text-xs p-2 rounded bg-gray-50/50 border border-gray-100">
              <div class={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                log.result === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center">
                  <span class={`font-medium ${
                    log.result === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {log.result === 'success' ? '更新成功' : '更新失败'}
                  </span>
                  <span class="text-gray-400 text-[10px]">{formatTime(log.timestamp)}</span>
                </div>
                {log.message && (
                  <p class="text-gray-500 mt-0.5 truncate" title={log.message}>
                    {log.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
