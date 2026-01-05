
import { useStore } from '@/store';
import { WeeklyMoodSettings } from './WeeklyMoodSettings';
import { ApiQueryParamsEditor } from './ApiQueryParamsEditor';

export function AvatarSourceSettings() {
  const { config, updateConfig } = useStore();

  return (
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">头像来源</h3>

      <div class="space-y-4">
        <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            来源类型
          </label>
          <select
            value={config.avatarSource}
            onChange={(e) => {
              const source = e.currentTarget.value;
              updateConfig('avatarSource', source);
              if (source === 'weekly-mood') {
                updateConfig('updateInterval', 24 * 60 * 60 * 1000);
              }
            }}
            class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm appearance-none"
          >
            <option value="random">随机头像</option>
            <option value="api">自定义API</option>
            <option value="weekly-mood">一周心情表</option>
          </select>
        </div>

        {config.avatarSource === 'api' && (
          <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API 地址
              </label>
              <input
                type="text"
                value={config.apiUrl}
                onChange={(e) => updateConfig('apiUrl', e.currentTarget.value)}
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                placeholder="https://api.dicebear.com/9.x/notionists/png"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API Query
              </label>
              <ApiQueryParamsEditor />
            </div>
          </div>
        )}

        {config.avatarSource === 'weekly-mood' && (
          <WeeklyMoodSettings />
        )}
      </div>
    </div>
  );
}

