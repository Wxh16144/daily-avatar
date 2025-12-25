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
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-white/90">
        {/* 标题栏 */}
        <div class="flex items-center justify-between bg-gray-50/50 backdrop-blur-sm px-4 py-3 border-b border-gray-100/50">
          <div class="flex items-center">
            <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] mr-2.5"></div>
            <h3 class="font-semibold text-gray-700 text-sm tracking-wide">头像更新器</h3>
          </div>
          <div class="flex space-x-1">
            <button
              onClick={() => toggleSettings(true)}
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
              title="设置"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => togglePanel(false)}
              class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
              title="关闭"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div class="p-4 space-y-4">
          {/* 状态显示 */}
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

          {/* 进度条 */}
          {stats.timeUntilNextUpdate > 0 && (
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
          )}

          {/* 操作按钮 */}
          <div class="pt-1">
            <button
              onClick={updateAvatar}
              disabled={isUpdating}
              class={`w-full py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${isUpdating
                ? 'bg-blue-400/80 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-[0.98]'
                } text-white font-medium text-sm`}
            >
              {isUpdating ? (
                <>
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>更新中...</span>
                </>
              ) : (
                <>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>立即更新</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 底部信息 */}
        <div class="px-4 py-2 bg-gray-50/30 backdrop-blur-sm border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
          <span class="font-medium">成功: {stats.successCount} / 总计: {stats.totalUpdates}</span>
          <span class="opacity-70">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}