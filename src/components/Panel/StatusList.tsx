import { useStore } from '@/store';

export function StatusList() {
  const { stats } = useStore();

  return (
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100">
        <span class="text-sm text-gray-600">今日状态</span>
        <span class={`font-semibold px-3 py-1 rounded-full text-xs ${
          stats.hasUpdatedToday
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {stats.hasUpdatedToday ? '✓ 已更新' : '未更新'}
        </span>
      </div>

      {stats.lastResult && (
        <div class={`p-3 rounded-lg border ${
          stats.lastResult === 'success'
            ? 'bg-green-50/50 border-green-100'
            : 'bg-red-50/50 border-red-100'
        }`}>
          <div class="flex items-start justify-between">
            <span class="text-sm text-gray-600">上次结果</span>
            <span class={`font-semibold text-xs ${
              stats.lastResult === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {stats.lastResult === 'success' ? '✓ 成功' : '✗ 失败'}
            </span>
          </div>
          {stats.lastErrorMessage && (
            <p class="text-xs text-red-600 mt-2 leading-relaxed">{stats.lastErrorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
