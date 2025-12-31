import { useStore } from '@/store';
import { formatDuration } from '@/utils/format';

export function BasicSettings() {
  const { config, updateConfig } = useStore();

  return (
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">基本设置</h3>

      <div class="space-y-4">
        <label class="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <span class="text-gray-700 font-medium">启用自动更新</span>
          <div class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig('enabled', e.currentTarget.checked)}
              class="sr-only"
            />
            <div class={`w-11 h-6 rounded-full border ${config.enabled ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-200'}`}></div>
            <div class={`absolute top-1 bg-white border border-gray-300 rounded-full h-4 w-4 ${config.enabled ? 'left-[22px] border-white' : 'left-1'}`}></div>
          </div>
        </label>

        <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3">
          <label class="block text-sm font-medium text-gray-700">
            更新频率
          </label>
          <div class="space-y-2">
            <input
              type="range"
              min="1"
              max="168"
              disabled={config.avatarSource === 'weekly-mood'}
              value={config.updateInterval / (60 * 60 * 1000)}
              onChange={(e) => updateConfig('updateInterval', parseInt(e.currentTarget.value) * 60 * 60 * 1000)}
              class={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${config.avatarSource === 'weekly-mood' ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200'}`}
            />
            <div class="flex justify-between text-xs text-gray-500 font-medium">
              <span>1小时</span>
              <span class="text-blue-600">
                {config.avatarSource === 'weekly-mood' ? '每天 (固定)' : formatDuration(config.updateInterval)}
              </span>
              <span>7天</span>
            </div>
            {config.avatarSource === 'weekly-mood' && (
              <p class="text-xs text-gray-400">一周心情表模式下，更新频率固定为每天一次</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
