import { useStore } from '@/store';
import type { NotificationType } from '@/store/initialState';

const typeStyles: Record<NotificationType, string> = {
  success: 'bg-green-500 text-white border-green-600',
  error: 'bg-red-500 text-white border-red-600',
  warning: 'bg-yellow-500 text-white border-yellow-600',
  info: 'bg-blue-500 text-white border-blue-600',
};

const typeIcons: Record<NotificationType, any> = {
  success: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function NotificationList() {
  const { ui: { notifications }, hideNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          class={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${typeStyles[notification.type]} animate-fadeIn transition-all duration-300`}
          style={{ minWidth: '200px', maxWidth: '320px' }}
        >
          <div class="flex-shrink-0">
            {typeIcons[notification.type]}
          </div>
          <div class="flex-1 text-sm font-medium">
            {notification.message}
          </div>
          <button
            onClick={() => hideNotification(notification.id)}
            class="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
