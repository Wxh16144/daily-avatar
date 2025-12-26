import { useStore } from '@/store';

export function NotificationSettings() {
  const { config, updateConfig } = useStore();

  return (
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">通知设置</h3>

      <div class="space-y-2 bg-gray-50/50 rounded-xl p-2 border border-gray-100">
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer">
          <span class="text-sm text-gray-700">启用通知</span>
          <input
            type="checkbox"
            checked={config.enableNotifications}
            onChange={(e) => updateConfig('enableNotifications', e.currentTarget.checked)}
            class="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </label>

        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer">
          <span class="text-sm text-gray-700">成功时通知</span>
          <input
            type="checkbox"
            checked={config.notifyOnSuccess}
            onChange={(e) => updateConfig('notifyOnSuccess', e.currentTarget.checked)}
            class="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </label>

        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer">
          <span class="text-sm text-gray-700">失败时通知</span>
          <input
            type="checkbox"
            checked={config.notifyOnFailure}
            onChange={(e) => updateConfig('notifyOnFailure', e.currentTarget.checked)}
            class="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
