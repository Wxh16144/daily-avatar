import { useStore } from '@/store';

export function Footer() {
  return (
    <div class="px-4 py-2 bg-gray-50/30 backdrop-blur-sm border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
      <span class="font-medium">Daily Avatar</span>
      <span class="opacity-70">v1.0.0</span>
    </div>
  );
}
