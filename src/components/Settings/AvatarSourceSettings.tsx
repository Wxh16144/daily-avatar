import { useStore } from '@/store';

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
            onChange={(e) => updateConfig('avatarSource', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm appearance-none"
          >
            <option value="random">随机头像</option>
            <option value="unsplash">Unsplash API</option>
            <option value="api">自定义API</option>
            <option value="local">本地图片</option>
          </select>
        </div>

        {config.avatarSource === 'api' && (
          <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100 animate-fadeIn">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              API地址
            </label>
            <input
              type="text"
              value={config.apiUrl}
              onChange={(e) => updateConfig('apiUrl', e.currentTarget.value)}
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="https://api.example.com/random-avatar"
            />
          </div>
        )}

        {config.avatarSource === 'unsplash' && (
          <div class="p-3 rounded-xl bg-gray-50/50 border border-gray-100 animate-fadeIn space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Unsplash Access Key
            </label>
            <input
              type="password"
              value={config.unsplashKey || ''}
              onChange={(e) => updateConfig('unsplashKey', e.currentTarget.value)}
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="输入你的Unsplash Access Key"
            />
            <p class="text-xs text-gray-500">
              获取地址: <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">unsplash.com/developers</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
