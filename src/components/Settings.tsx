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
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30 transition-all duration-300">
      {/* 遮罩 */}
      <div
        class="absolute inset-0"
        onClick={() => toggleSettings(false)}
      ></div>

      {/* 设置面板 */}
      <div class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-white/20 transform transition-all duration-300 scale-100">
        {/* 标题 */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50 backdrop-blur-sm">
          <h2 class="text-lg font-semibold text-gray-800 tracking-tight">设置</h2>
          <button
            onClick={() => toggleSettings(false)}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div class="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div class="px-6 py-6 space-y-8">
            {/* 基本设置 */}
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
                      max="720"
                      value={config.updateInterval / (60 * 60 * 1000)}
                      onChange={(e) => updateConfig('updateInterval', parseInt(e.currentTarget.value) * 60 * 60 * 1000)}
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div class="flex justify-between text-xs text-gray-500 font-medium">
                      <span>1小时</span>
                      <span class="text-blue-600">{config.updateInterval / (60 * 60 * 1000)}小时</span>
                      <span>30天</span>
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

            {/* 头像来源 */}
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

            {/* 通知设置 */}
            <div class="space-y-4">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">通知设置</h3>

              <div class="space-y-2 bg-gray-50/50 rounded-xl p-2 border border-gray-100">
                <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <span class="text-sm text-gray-700">启用通知</span>
                  <input
                    type="checkbox"
                    checked={config.enableNotifications}
                    onChange={(e) => updateConfig('enableNotifications', e.currentTarget.checked)}
                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>

                <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <span class="text-sm text-gray-700">成功时通知</span>
                  <input
                    type="checkbox"
                    checked={config.notifyOnSuccess}
                    onChange={(e) => updateConfig('notifyOnSuccess', e.currentTarget.checked)}
                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>

                <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                  <span class="text-sm text-gray-700">失败时通知</span>
                  <input
                    type="checkbox"
                    checked={config.notifyOnFailure}
                    onChange={(e) => updateConfig('notifyOnFailure', e.currentTarget.checked)}
                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div class="px-6 py-4 border-t border-gray-100/50 bg-gray-50/50 backdrop-blur-sm">
          <div class="flex justify-between items-center">
            <button
              onClick={handleReset}
              class="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              恢复默认
            </button>

            <div class="space-x-3 flex">
              <button
                onClick={() => toggleSettings(false)}
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                class={`px-5 py-2 text-sm font-medium text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all ${isSaving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]'
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