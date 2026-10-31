import { PhotoItem, CanvasSettings, LayoutSlot } from '../types/collage';
import { ASPECT_RATIOS } from './layoutEngine';
import { FILTER_PRESETS } from '../../assets/js/collage-filters';

interface RenderOptions {
  photos: PhotoItem[];
  slots: LayoutSlot[];
  settings: CanvasSettings;
  scale?: number; // 1 for standard, 2 for retina / high-res
}

/**
 * Loads an in-memory image asynchronously
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Renders the entire collage into an offscreen HTML5 canvas element
 * 100% Client-Side in volatile browser memory.
 */
export async function renderCollageToCanvas({
  photos,
  slots,
  settings,
  scale = 1,
}: RenderOptions): Promise<HTMLCanvasElement> {
  const baseDim = ASPECT_RATIOS[settings.aspectRatio] || ASPECT_RATIOS['1:1'];
  const targetWidth = baseDim.width * scale;
  const targetHeight = baseDim.height * scale;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Smooth rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Background
  if (settings.bgType === 'gradient') {
    // Parse or generate gradient across canvas
    const gradient = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
    if (settings.gradientPreset.includes('Sunset')) {
      gradient.addColorStop(0, '#ff7e5f');
      gradient.addColorStop(1, '#feb47b');
    } else if (settings.gradientPreset.includes('Neon') || settings.gradientPreset.includes('Purple')) {
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');
    } else if (settings.gradientPreset.includes('Ocean')) {
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(1, '#3b82f6');
    } else if (settings.gradientPreset.includes('Peach')) {
      gradient.addColorStop(0, '#fbcfe8');
      gradient.addColorStop(1, '#fed7aa');
    } else if (settings.gradientPreset.includes('Midnight')) {
      gradient.addColorStop(0, '#09090b');
      gradient.addColorStop(1, '#27272a');
    } else {
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#a855f7');
    }
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = settings.bgColor || '#ffffff';
  }
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Scaled dimensions for padding, gap, radius
  const paddingPx = settings.padding * scale * (targetWidth / 1000);
  const gapPx = settings.gap * scale * (targetWidth / 1000);
  const radiusPx = settings.radius * scale * (targetWidth / 1000);

  // Usable area inside outer padding
  const contentWidth = targetWidth - paddingPx * 2;
  const contentHeight = targetHeight - paddingPx * 2;

  // Pre-load all photo images in memory
  const loadedImages = await Promise.all(
    photos.map(async (p) => {
      try {
        const img = await loadImage(p.url);
        return { photo: p, img };
      } catch (err) {
        console.warn('Failed to load image for rendering', p.url, err);
        return null;
      }
    })
  );

  // 2. Draw Each Photo Slot
  for (let i = 0; i < slots.length; i++) {
    const item = loadedImages[i];
    if (!item || !item.img) continue;

    const { photo, img } = item;
    const slot = slots[i];

    // Compute slot pixel coordinates
    const rawX = paddingPx + (slot.x / 100) * contentWidth;
    const rawY = paddingPx + (slot.y / 100) * contentHeight;
    const rawW = (slot.width / 100) * contentWidth;
    const rawH = (slot.height / 100) * contentHeight;

    // Inset slot for inner gap
    const halfGap = gapPx / 2;
    const slotX = rawX + halfGap;
    const slotY = rawY + halfGap;
    const slotW = Math.max(1, rawW - gapPx);
    const slotH = Math.max(1, rawH - gapPx);

    // Save context state for clipping & transforms
    ctx.save();

    // Clip rounded rectangle
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(slotX, slotY, slotW, slotH, radiusPx);
    } else {
      // Fallback rounded rect path
      drawFallbackRoundRect(ctx, slotX, slotY, slotW, slotH, radiusPx);
    }
    ctx.clip();

    // Apply Filter
    const filterPreset = FILTER_PRESETS.find((f) => f.id === photo.filterId);
    if (filterPreset && filterPreset.filter !== 'none') {
      ctx.filter = filterPreset.filter;
    } else {
      ctx.filter = 'none';
    }

    // Object-cover math with zoom & pan offsets
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    // Rotation transform if any
    const centerX = slotX + slotW / 2;
    const centerY = slotY + slotH / 2;

    ctx.translate(centerX, centerY);
    if (photo.rotation) {
      ctx.rotate((photo.rotation * Math.PI) / 180);
    }

    // Determine dimensions post-rotation
    const isRotated90or270 = photo.rotation === 90 || photo.rotation === 270;
    const effectiveSlotW = isRotated90or270 ? slotH : slotW;
    const effectiveSlotH = isRotated90or270 ? slotW : slotH;

    const scaleFactor = Math.max(effectiveSlotW / imgW, effectiveSlotH / imgH) * (photo.zoom || 1);
    const drawW = imgW * scaleFactor;
    const drawH = imgH * scaleFactor;

    // Draw image centered in slot
    ctx.drawImage(
      img,
      -drawW / 2 + (photo.offsetX || 0) * scale,
      -drawH / 2 + (photo.offsetY || 0) * scale,
      drawW,
      drawH
    );

    ctx.restore();
  }

  // 3. Draw Aesthetic Text Stamp / Date Stamp if enabled
  if (settings.textStamp && settings.textStamp.enabled && settings.textStamp.text) {
    ctx.save();
    ctx.filter = 'none';
    ctx.fillStyle = settings.textStamp.color || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.max(16, Math.round(targetWidth * 0.024));
    let fontName = 'Inter, sans-serif';
    if (settings.textStamp.fontStyle === 'serif') fontName = 'serif';
    else if (settings.textStamp.fontStyle === 'typewriter') fontName = 'Courier, monospace';
    else if (settings.textStamp.fontStyle === 'handwriting') fontName = 'cursive';

    ctx.font = `600 ${fontSize}px ${fontName}`;
    const stampY =
      settings.textStamp.position === 'top'
        ? paddingPx / 2 || fontSize * 1.5
        : targetHeight - (paddingPx / 2 || fontSize * 1.5);

    // Optional subtle text shadow for readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.fillText(settings.textStamp.text.toUpperCase(), targetWidth / 2, stampY);
    ctx.restore();
  }

  return canvas;
}

/**
 * Downloads canvas directly to user's device. 0 server connection.
 */
export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  filename = 'collagecraft-art'
): Promise<void> {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  const quality = format === 'png' ? undefined : 0.95;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality);
  });

  if (!blob) throw new Error('Failed to create image blob');

  // Trigger browser download via object URL
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${filename}-${Date.now()}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke object URL after slight delay
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * Copies canvas image directly to OS clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    return false;
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });

  if (!blob) return false;

  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return false;
  }
}

function drawFallbackRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
