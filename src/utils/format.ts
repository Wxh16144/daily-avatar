export function formatDuration(ms: number, compact = false): string {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) {
    return compact ? '0m' : '0分钟';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (compact) {
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }

  if (days > 0) {
    const h = hours % 24;
    return h > 0 ? `${days}天${h}小时` : `${days}天`;
  }
  if (hours > 0) {
    const m = minutes % 60;
    return m > 0 ? `${hours}小时${m}分钟` : `${hours}小时`;
  }
  return `${minutes}分钟`;
}

export function formatTime(timestamp: number): string {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return '从未';
  }
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(timestamp: number): string {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return '从未';
  }
  return new Date(timestamp).toLocaleDateString('zh-CN');
}
