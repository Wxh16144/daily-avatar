import { CONFIG } from './config';
import { resolveAdapter } from './adapters';
import { createSwapEffect } from './effect';
import { registerMenu } from './menu';
import { AvatarPipeline } from './pipeline';

function main() {
  const adapter = resolveAdapter(new URL(window.location.href));
  if (!adapter) return;

  const effect = createSwapEffect();
  const pipeline = new AvatarPipeline(adapter, {
    onSwap: (img, originalUrl) => effect.play(img, originalUrl),
    onReset: () => effect.cancelAll(),
  });

  pipeline.start();
  registerMenu(pipeline);

  // 方便在控制台手动排查：__avatarMask.pipeline.getStats()
  Object.assign(window, { __avatarMask: { pipeline, effect, config: CONFIG } });
}

main();
