import { useStore } from '@/store';

export function BasicSettings() {
  const { config, updateConfig } = useStore();

  return (
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">基本设置</h3>

      <div class="space-y-4">
        <label class="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100">
          <span class="text-gray-700 font-medium">启用自动更新</span>
          <div class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig('enabled', e.currentTarget.checked)}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
              value={config.updateInterval / (60 * 60 * 1000)}
              onChange={(e) => updateConfig('updateInterval', parseInt(e.currentTarget.value) * 60 * 60 * 1000)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div class="flex justify-between text-xs text-gray-500 font-medium">
              <span>1小时</span>
              <span class="text-blue-600">
                {(() => {
                  const hours = Math.floor(config.updateInterval / (60 * 60 * 1000));
                  if (hours < 24) return `${hours}小时`;
                  const days = Math.floor(hours / 24);
                  const rest = hours % 24;
                  return rest > 0 ? `${days}天${rest}小时` : `${days}天`;
                })()}
              </span>
              <span>7天</span>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            每天更新时间
          </label>
          <input
            type="time"
            value={config.updateTime}
            onChange={(e) => updateConfig('updateTime', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
