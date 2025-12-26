import { useState, useRef } from 'preact/hooks';
import { useStore } from '@/store';
import { BasicSettings } from './BasicSettings';
import { AvatarSourceSettings } from './AvatarSourceSettings';
import { NotificationSettings } from './NotificationSettings';

export function Settings() {
  const {
    saveConfig,
    resetConfig,
    toggleSettings,
    showNotification
  } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveConfig();
      showNotification('设置已保存', 'success');
    } catch (error) {
      console.error('保存失败:', error);
      showNotification('保存失败', 'error');
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
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      {/* 遮罩 */}
      <div
        class="absolute inset-0"
        onClick={() => toggleSettings(false)}
      ></div>

      {/* 设置面板 */}
      <div class="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden panel-style">
        {/* 标题 */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 class="text-lg font-semibold text-gray-800 tracking-tight">设置</h2>
          <button
            onClick={() => toggleSettings(false)}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg"
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
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div class="flex justify-between items-center">
            <button
              onClick={handleReset}
              class="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg"
            >
              恢复默认
            </button>

            <div class="space-x-3 flex">
              <button
                onClick={() => toggleSettings(false)}
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg border border-transparent"
              >
                取消
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                class={`px-5 py-2 text-sm font-medium text-white rounded-lg border ${isSaving
                  ? 'bg-blue-400 border-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 border-blue-600 hover:bg-blue-700 active:bg-blue-800'
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
