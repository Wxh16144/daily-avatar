import { useStore } from '@/store';

export function StatusList() {
  const { stats } = useStore();

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '从未';
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="space-y-2.5">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">今日更新</span>
        <span class={`font-medium px-2 py-0.5 rounded-full text-xs ${stats.hasUpdatedToday
          ? 'bg-green-100 text-green-600 border border-green-200'
          : 'bg-red-100 text-red-600 border border-red-200'
          }`}>
          {stats.hasUpdatedToday ? '已完成' : '未完成'}
        </span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">成功率</span>
        <div class="flex items-center space-x-2">
          <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class={`h-full rounded-full ${stats.successRate >= 90 ? 'bg-green-500' :
                stats.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
          <span class="font-medium text-gray-700 text-xs">{stats.successRate}%</span>
        </div>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">上次更新</span>
        <span class="text-gray-700 font-medium text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {formatTime(stats.lastUpdateTime)}
        </span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">下次更新</span>
        <span class="text-gray-700 font-medium text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {formatTime(stats.nextUpdateTime)}
        </span>
      </div>
    </div>
  );
}
