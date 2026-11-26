import type { AvatarPipeline } from './pipeline';

/**
 * 只注册运行期命令，不写入任何持久化数据。
 * 某些管理器不支持菜单 API，这里做静默降级。
 */
export function registerMenu(pipeline: AvatarPipeline): void {
  if (typeof GM_registerMenuCommand !== 'function') return;

  GM_registerMenuCommand('📊 查看当前状态', () => {
    const stats = pipeline.getStats();
    const mode = pipeline.getMode();
    window.alert(
      [
        `模式：${pipeline.isEnabled() ? (mode === 'blur' ? '模糊头像' : '丑头像替换') : '已还原'}`,
        '',
        mode === 'blur' ? `已模糊：${stats.blurred}` : `已替换：${stats.masked}`,
        `失败：${stats.failed}`,
        `排队中：${stats.pending}`,
        `进行中：${stats.active}`,
      ].join('\n'),
    );
  });

  // 模糊模式不请求任何图片：只给原头像叠一层 CSS blur
  GM_registerMenuCommand('🌫️ 模糊所有头像（不请求图片）', () => {
    pipeline.setMode('blur');
  });

  GM_registerMenuCommand('🎭 换成丑头像', () => {
    pipeline.setMode('mask');
  });

  GM_registerMenuCommand('😇 临时还原头像', () => {
    pipeline.stop();
    pipeline.restore();
  });
}
