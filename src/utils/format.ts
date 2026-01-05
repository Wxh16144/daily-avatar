export function formatDuration(ms: number, compact = false): string {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) {
    return compact ? '0s' : '0秒';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (compact) {
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  if (days > 0) {
    const h = hours % 24;
    return h > 0 ? `${days}天${h}小时` : `${days}天`;
  }
  if (hours > 0) {
    const m = minutes % 60;
    return m > 0 ? `${hours}小时${m}分钟` : `${hours}小时`;
  }
  if (minutes > 0) {
    const s = seconds % 60;
    return s > 0 ? `${minutes}分钟${s}秒` : `${minutes}分钟`;
  }
  return `${seconds}秒`;
}

export function formatTime(timestamp: number, withDate = false): string {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return '从未';
  }
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (withDate || !isToday) {
    return `${date.toLocaleDateString('zh-CN')} ${timeStr}`;
  }
  return timeStr;
}

export function formatDate(timestamp: number): string {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
    return '从未';
  }
  return new Date(timestamp).toLocaleDateString('zh-CN');
}
