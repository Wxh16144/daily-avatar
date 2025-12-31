import { useStore } from '@/store';

export function AvatarTrigger() {
  const { ui: { isUpdating }, togglePanel } = useStore();

  return (
    <button
      onClick={() => togglePanel(true)}
      class={`bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition duration-200 fixed bottom-4 right-4 z-50`}
      aria-busy={isUpdating}
      aria-label={isUpdating ? '正在更新' : '立即更新'}
    >
      {isUpdating ? (
        <span class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>更新中...</span>
        </span>
      ) : (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </button>
  );
}
