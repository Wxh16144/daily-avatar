import { useStore } from '@/store';
import { formatTime } from '@/utils/format';

export function StatusList() {
  const { stats } = useStore();
  const hasUpdatedToday = stats.lastUpdate > 0 && new Date(stats.lastUpdate).toDateString() === new Date().toDateString();

  return (
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100" style={{ border: '1px solid #f3f4f6' }}>
        <span class="text-sm text-gray-600">今日状态</span>
        <span class={`font-semibold px-3 py-1 rounded-full text-xs ${hasUpdatedToday
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
          }`}
          style={{
            backgroundColor: hasUpdatedToday ? '#dcfce7' : '#f3f4f6',
            color: hasUpdatedToday ? '#15803d' : '#4b5563'
          }}>
          {hasUpdatedToday ? '✓ 已更新' : '未更新'}
        </span>
      </div>

      {/* 上次结果 */}
      {stats.lastResult && (
        <div class={`p-3 rounded-lg border ${stats.lastResult === 'success'
            ? 'bg-green-50/50 border-green-100'
            : 'bg-red-50/50 border-red-100'
          }`}
          style={{
            backgroundColor: stats.lastResult === 'success' ? 'rgba(240, 253, 244, 0.5)' : 'rgba(254, 242, 242, 0.5)',
            borderColor: stats.lastResult === 'success' ? '#dcfce7' : '#fee2e2',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}>
          <div class="flex items-start justify-between">
            <span class="text-sm text-gray-600">上次结果</span>
            <span class={`font-semibold text-xs ${stats.lastResult === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
              style={{ color: stats.lastResult === 'success' ? '#15803d' : '#b91c1c' }}>
              {stats.lastResult === 'success' ? '✓ 成功' : '✗ 失败'}
            </span>
          </div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-400">{formatTime(stats.lastUpdate, true)}</span>
          </div>
          {stats.lastErrorMessage && (
            <p class="text-xs text-red-600 mt-2 leading-relaxed" style={{ color: '#dc2626' }}>{stats.lastErrorMessage}</p>
          )}
        </div>
      )}


    </div>
  );
}
