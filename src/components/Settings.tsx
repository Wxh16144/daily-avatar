import { useState } from 'react';
import { useStore } from '@/store';

export function Settings() {
  const { 
    config, 
    updateConfig, 
    saveConfig, 
    resetConfig, 
    toggleSettings 
  } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveConfig();
      // 显示保存成功提示
      setTimeout(() => {
        const tip = document.createElement('div');
        tip.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        tip.textContent = '设置已保存';
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
      }, 100);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('确定要重置为默认设置吗？')) {
      await resetConfig();
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => toggleSettings(false)}
      ></div>

      {/* 设置面板 */}
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* 标题 */}
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">设置</h2>
          <button
            onClick={() => toggleSettings(false)}
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 内容区域 */}
        <div class="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div class="px-6 py-4 space-y-6">
            {/* 基本设置 */}
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">基本设置</h3>

              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => updateConfig('enabled', e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-gray-700">启用自动更新</span>
                </label>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    更新频率（小时）
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="720"
                    value={config.updateInterval / (60 * 60 * 1000)}
                    onChange={(e) => updateConfig('updateInterval', parseInt(e.currentTarget.value) * 60 * 60 * 1000)}
                    class="w-full"
                  />
                  <div class="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1小时</span>
                    <span>{config.updateInterval / (60 * 60 * 1000)}小时</span>
                    <span>30天</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    每天更新时间
                  </label>
                  <input
                    type="time"
                    value={config.updateTime}
                    onChange={(e) => updateConfig('updateTime', e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 头像来源 */}
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">头像来源</h3>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    来源类型
                  </label>
                  <select
                    value={config.avatarSource}
                    onChange={(e) => updateConfig('avatarSource', e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="random">随机头像</option>
                    <option value="unsplash">Unsplash API</option>
                    <option value="api">自定义API</option>
                    <option value="local">本地图片</option>
                  </select>
                </div>

                {config.avatarSource === 'api' && (
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      API地址
                    </label>
                    <input
                      type="text"
                      value={config.apiUrl}
                      onChange={(e) => updateConfig('apiUrl', e.currentTarget.value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://api.example.com/random-avatar"
                    />
                  </div>
                )}

                {config.avatarSource === 'unsplash' && (
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Unsplash Access Key
                    </label>
                    <input
                      type="password"
                      value={config.unsplashKey || ''}
                      onChange={(e) => updateConfig('unsplashKey', e.currentTarget.value)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="输入你的Unsplash Access Key"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      获取地址: <a href="https://unsplash.com/developers" class="text-blue-500">unsplash.com/developers</a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 通知设置 */}
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">通知设置</h3>

              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enableNotifications}
                    onChange={(e) => updateConfig('enableNotifications', e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-gray-700">启用通知</span>
                </label>

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notifyOnSuccess}
                    onChange={(e) => updateConfig('notifyOnSuccess', e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-gray-700">成功时通知</span>
                </label>

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notifyOnFailure}
                    onChange={(e) => updateConfig('notifyOnFailure', e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-gray-700">失败时通知</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div class="px-6 py-4 border-t bg-gray-50">
          <div class="flex justify-between">
            <button
              onClick={handleReset}
              class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              恢复默认
            </button>

            <div class="space-x-3">
              <button
                onClick={() => toggleSettings(false)}
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                class={`px-4 py-2 bg-blue-500 text-white rounded-lg transition ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
              >
                {isSaving ? '保存中...' : '保存设置'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}