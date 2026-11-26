import type { AvatarPipeline } from './pipeline';

/**
 * 只注册诊断与临时切换命令，不写入任何持久化数据。
 * 某些管理器不支持菜单 API，这里做静默降级。
 */
export function registerMenu(pipeline: AvatarPipeline): void {
  if (typeof GM_registerMenuCommand !== 'function') return;

  GM_registerMenuCommand('📊 查看替换统计', () => {
    const stats = pipeline.getStats();
    window.alert(
      [
        `已替换：${stats.masked}`,
        `失败：${stats.failed}`,
        `排队中：${stats.pending}`,
        `进行中：${stats.active}`,
        `当前状态：${pipeline.isEnabled() ? '伪装中' : '已还原'}`,
      ].join('\n'),
    );
  });

  GM_registerMenuCommand('😇 临时还原头像', () => {
    pipeline.stop();
    pipeline.restore();
  });

  GM_registerMenuCommand('🎭 重新伪装头像', () => {
    pipeline.restart();
  });
}
