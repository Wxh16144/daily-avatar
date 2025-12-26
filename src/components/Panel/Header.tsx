import { useStore } from '@/store';

export function Header() {
  const { ui: { title }, toggleSettings, togglePanel } = useStore();
  
  return (
    <div class="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm px-4 py-3 border-b border-gray-200">
      <div class="flex items-center">
        <div class="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2.5"></div>
        <h3 class="font-semibold text-gray-700 text-sm tracking-wide">{title}</h3>
      </div>
      <div class="flex space-x-1">
        <button
          onClick={() => toggleSettings(true)}
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          title="设置"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={() => togglePanel(false)}
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          title="关闭"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
