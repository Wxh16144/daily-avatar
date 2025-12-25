import { useEffect } from 'react';
import { useStore } from '@/store';

export function Panel() {
  const { 
    config,
    stats, 
    ui: { isUpdating }, 
    toggleSettings, 
    togglePanel, 
    refreshStats, 
    updateAvatar 
  } = useStore();

  // 定时更新状态
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // 30秒更新一次

    return () => clearInterval(interval);
  }, [refreshStats]);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '从未';
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="fixed bottom-4 right-4 z-50 w-64">
      <div class="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
        {/* 标题栏 */}
        <div class="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <h3 class="font-bold text-gray-700">头像更新器</h3>
          </div>
          <div class="flex space-x-2">
            <button
              onClick={() => toggleSettings(true)}
              class="text-gray-500 hover:text-gray-700 transition"
              title="设置"
            >
              ⚙️
            </button>
            <button
              onClick={() => togglePanel(false)}
              class="text-gray-500 hover:text-gray-700 transition"
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div class="p-4">
          {/* 状态显示 */}
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">今日更新:</span>
              <span class={`text-sm font-bold ${stats.hasUpdatedToday ? 'text-green-500' : 'text-red-500'}`}>
                {stats.hasUpdatedToday ? '✓ 已更新' : '✗ 未更新'}
              </span>
            </div>

            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">成功率:</span>
              <span class={`text-sm font-bold ${stats.successRate >= 90 ? 'text-green-500' :
                stats.successRate >= 70 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                {stats.successRate}%
              </span>
            </div>

            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">上次更新:</span>
              <span class="text-sm">{formatTime(stats.lastUpdateTime)}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">下次更新:</span>
              <span class="text-sm">{formatTime(stats.nextUpdateTime)}</span>
            </div>
          </div>

          {/* 进度条 */}
          {stats.timeUntilNextUpdate > 0 && (
            <div class="mb-4">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>更新进度</span>
                <span>{Math.round((1 - stats.timeUntilNextUpdate / config.updateInterval) * 100)}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(1 - stats.timeUntilNextUpdate / config.updateInterval) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div class="space-y-2">
            <button
              onClick={updateAvatar}
              disabled={isUpdating}
              class={`w-full py-2 rounded-lg transition duration-200 ${isUpdating
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-medium`}
            >
              {isUpdating ? '更新中...' : '立即更新'}
            </button>

            <button
              onClick={() => toggleSettings(true)}
              class="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 text-gray-700"
            >
              设置
            </button>
          </div>
        </div>

        {/* 底部信息 */}
        <div class="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
          <div class="flex justify-between">
            <span>成功率: {stats.successCount}/{stats.totalUpdates}</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}