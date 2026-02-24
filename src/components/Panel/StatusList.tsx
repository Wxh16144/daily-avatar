import { useStore } from '@/store';
import { formatTime } from '@/utils/format';

export function StatusList() {
  const { stats } = useStore();
  const hasUpdatedToday = stats.lastUpdate > 0 && new Date(stats.lastUpdate).toDateString() === new Date().toDateString();

  const getStatusConfig = () => {
    if (stats.lastResult === 'success') {
      return {
        className: 'bg-green-100 text-green-700',
        style: { backgroundColor: '#dcfce7', color: '#15803d' },
        text: hasUpdatedToday ? '✓ 今日已更新' : '✓ 上次更新成功'
      };
    }
    if (stats.lastResult === 'failure') {
      return {
        className: 'bg-red-100 text-red-700',
        style: { backgroundColor: '#fee2e2', color: '#b91c1c' },
        text: hasUpdatedToday ? '✗ 今日更新失败' : '✗ 上次更新失败'
      };
    }
    return {
      className: 'bg-gray-100 text-gray-600',
      style: { backgroundColor: '#f3f4f6', color: '#4b5563' },
      text: '暂无记录'
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100" style={{ border: '1px solid #f3f4f6' }}>
        <span class="text-sm text-gray-600">最近状态</span>
        <div 
          className={`font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusConfig.className}`}
          style={statusConfig.style}
        >
          {statusConfig.text}
        </div>
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
