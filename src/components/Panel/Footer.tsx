import { APP_META } from '@/constants/meta';

export function Footer() {
  return (
    <div class="px-4 py-2 bg-gray-50/30 backdrop-blur-sm border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
      <a 
        href={APP_META.github} 
        target="_blank" 
        rel="noopener noreferrer" 
        class="font-medium hover:text-blue-600 transition-colors cursor-pointer"
        style={{ textDecoration: 'none' }}
      >
        {APP_META.name}
      </a>
      <span class="opacity-70">v{APP_META.version}</span>
    </div>
  );
}
