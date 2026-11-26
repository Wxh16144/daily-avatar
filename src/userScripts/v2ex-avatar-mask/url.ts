import { CONFIG } from './config';

export interface Box {
  width: number;
  height: number;
}

export function buildUrl(seed: string): string {
  return CONFIG.urlTemplate
    .replace('{host}', CONFIG.host.replace(/\/+$/, ''))
    .replace('{id}', encodeURIComponent(seed))
    .replace('{format}', CONFIG.format)
    .replace('{size}', String(CONFIG.size));
}

/** 判断 src 是否已经是我们插入的地址（而不是站点原始头像） */
export function isMaskedSrc(src: string | null): boolean {
  if (!src) return false;
  return src.startsWith(CONFIG.host.replace(/\/+$/, ''));
}

/**
 * 读取头像当前的布局尺寸。
 * 必须在替换前调用：此时 img 显示的是站点原始头像，
 * 布局尺寸才是「官方排版」的真实大小（回复区等位置没有 width 属性，
 * 完全由原图 48px 决定，不能拿我们插入的 128px 图去量）。
 */
export function measureBox(img: HTMLImageElement): Box | null {
  const rect = img.getBoundingClientRect();
  if (rect.width >= 1 && rect.height >= 1) {
    return { width: rect.width, height: rect.height };
  }

  const width = Number(img.getAttribute('width'));
  if (width >= 1) {
    const height = Number(img.getAttribute('height'));
    return { width, height: height >= 1 ? height : width };
  }

  // 元素不可见时退回原始图片的固有尺寸
  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    return { width: img.naturalWidth, height: img.naturalHeight };
  }

  return null;
}
