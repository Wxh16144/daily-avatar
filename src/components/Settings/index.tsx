import { useState } from 'react';
import { useStore } from '@/store';
import { BasicSettings } from './BasicSettings';
import { AvatarSourceSettings } from './AvatarSourceSettings';
import { NotificationSettings } from './NotificationSettings';

export function Settings() {
  const { 
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
            <BasicSettings />
            <AvatarSourceSettings />
            <NotificationSettings />
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
