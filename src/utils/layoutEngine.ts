import { LayoutId, LayoutSlot, AspectRatio, BackgroundPreset } from '../types/collage';

export const ASPECT_RATIOS: Record<AspectRatio, { labelKey: string; ratio: number; width: number; height: number }> = {
  '1:1': { labelKey: 'aspectRatios.1:1', ratio: 1 / 1, width: 1200, height: 1200 },
  '4:5': { labelKey: 'aspectRatios.4:5', ratio: 4 / 5, width: 1200, height: 1500 },
  '9:16': { labelKey: 'aspectRatios.9:16', ratio: 9 / 16, width: 1080, height: 1920 },
  '16:9': { labelKey: 'aspectRatios.16:9', ratio: 16 / 9, width: 1920, height: 1080 },
  '3:4': { labelKey: 'aspectRatios.3:4', ratio: 3 / 4, width: 1200, height: 1600 },
  '4:3': { labelKey: 'aspectRatios.4:3', ratio: 4 / 3, width: 1600, height: 1200 },
};

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: 'white', nameKey: 'backgrounds.white', type: 'solid', value: '#ffffff', textColor: '#111827' },
  { id: 'black', nameKey: 'backgrounds.black', type: 'solid', value: '#0f1115', textColor: '#f9fafb' },
  { id: 'cream', nameKey: 'backgrounds.cream', type: 'solid', value: '#faf7f2', textColor: '#292524' },
  { id: 'pink', nameKey: 'backgrounds.pink', type: 'solid', value: '#fee2e2', textColor: '#881337' },
  { id: 'lavender', nameKey: 'backgrounds.lavender', type: 'solid', value: '#f3e8ff', textColor: '#581c87' },
  { id: 'mint', nameKey: 'backgrounds.mint', type: 'solid', value: '#ecfdf5', textColor: '#064e3b' },
  { id: 'slate', nameKey: 'Slate Dark', type: 'solid', value: '#1e293b', textColor: '#f8fafc' },
  { id: 'gradientSunset', nameKey: 'backgrounds.gradientSunset', type: 'gradient', value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', textColor: '#ffffff' },
  { id: 'gradientPurple', nameKey: 'backgrounds.gradientPurple', type: 'gradient', value: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', textColor: '#ffffff' },
  { id: 'gradientOcean', nameKey: 'backgrounds.gradientOcean', type: 'gradient', value: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', textColor: '#ffffff' },
  { id: 'gradientPeach', nameKey: 'backgrounds.gradientPeach', type: 'gradient', value: 'linear-gradient(135deg, #fbcfe8 0%, #fed7aa 100%)', textColor: '#831843' },
  { id: 'gradientMidnight', nameKey: 'Midnight Aura', type: 'gradient', value: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)', textColor: '#f4f4f5' },
];

export interface LayoutPresetInfo {
  id: LayoutId;
  nameKey: string;
  category: 'grid' | 'trendy' | 'photobooth';
  recommendedPhotos: number;
}

export const LAYOUT_PRESETS: LayoutPresetInfo[] = [
  { id: 'auto', nameKey: 'presets.layoutAuto', category: 'trendy', recommendedPhotos: 4 },
  { id: 'life4cuts-strip', nameKey: 'presets.layoutLife4cutsStrip', category: 'photobooth', recommendedPhotos: 4 },
  { id: 'life4cuts-2x2', nameKey: 'presets.layoutLife4cuts2x2', category: 'photobooth', recommendedPhotos: 4 },
  { id: 'editorial-hero', nameKey: 'presets.layoutEditorialHero', category: 'trendy', recommendedPhotos: 3 },
  { id: 'editorial-sidebar', nameKey: 'presets.layoutEditorialSidebar', category: 'trendy', recommendedPhotos: 4 },
  { id: 'polaroid-trio', nameKey: 'presets.layoutPolaroidTrio', category: 'trendy', recommendedPhotos: 3 },
  { id: 'asymmetric-split', nameKey: 'presets.layoutAsymmetricSplit', category: 'trendy', recommendedPhotos: 2 },
  { id: 'grid-2x2', nameKey: 'presets.layoutGrid2x2', category: 'grid', recommendedPhotos: 4 },
  { id: 'grid-1x2', nameKey: 'presets.layoutGrid1x2', category: 'grid', recommendedPhotos: 2 },
  { id: 'grid-2x1', nameKey: 'presets.layoutGrid2x1', category: 'grid', recommendedPhotos: 2 },
  { id: 'grid-3x2', nameKey: 'presets.layoutGrid3x2', category: 'grid', recommendedPhotos: 6 },
  { id: 'grid-2x3', nameKey: 'presets.layoutGrid2x3', category: 'grid', recommendedPhotos: 6 },
  { id: 'grid-3x3', nameKey: 'presets.layoutGrid3x3', category: 'grid', recommendedPhotos: 9 },
  { id: 'filmstrip', nameKey: 'presets.layoutFilmstrip', category: 'trendy', recommendedPhotos: 3 },
];

/**
 * Computes slot positions (0 to 100% bounds) for a chosen layout and photo count
 */
export function computeLayoutSlots(
  layoutId: LayoutId,
  count: number,
  aspectRatio: AspectRatio = '1:1',
  hasFooterStamp: boolean = false
): LayoutSlot[] {
  const safeCount = Math.max(1, count);

  // If auto, resolve to best layout based on photo count
  if (layoutId === 'auto') {
    return computeAutoSlots(safeCount, aspectRatio);
  }

  // Handle specific named layouts
  switch (layoutId) {
    case 'grid-1x2': // 1 column, 2 rows
      return [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 0, y: 50, width: 100, height: 50 },
      ];

    case 'grid-2x1': // 2 columns, 1 row
      return [
        { x: 0, y: 0, width: 50, height: 100 },
        { x: 50, y: 0, width: 50, height: 100 },
      ];

    case 'grid-2x2':
      return [
        { x: 0, y: 0, width: 50, height: 50 },
        { x: 50, y: 0, width: 50, height: 50 },
        { x: 0, y: 50, width: 50, height: 50 },
        { x: 50, y: 50, width: 50, height: 50 },
      ];

    case 'grid-3x2': // 3 columns, 2 rows
      return Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          x: col * (100 / 3),
          y: row * 50,
          width: 100 / 3,
          height: 50,
        };
      });

    case 'grid-2x3': // 2 columns, 3 rows
      return Array.from({ length: 6 }, (_, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return {
          x: col * 50,
          y: row * (100 / 3),
          width: 50,
          height: 100 / 3,
        };
      });

    case 'grid-3x3':
      return Array.from({ length: 9 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          x: col * (100 / 3),
          y: row * (100 / 3),
          width: 100 / 3,
          height: 100 / 3,
        };
      });

    case 'life4cuts-strip': {
      // 4 vertical cuts stacked, with bottom footer space for date stamp/logo
      const photoAreaHeight = hasFooterStamp ? 88 : 92;
      const slotHeight = photoAreaHeight / 4;
      return [
        { x: 4, y: 2, width: 92, height: slotHeight - 1 },
        { x: 4, y: 2 + slotHeight, width: 92, height: slotHeight - 1 },
        { x: 4, y: 2 + slotHeight * 2, width: 92, height: slotHeight - 1 },
        { x: 4, y: 2 + slotHeight * 3, width: 92, height: slotHeight - 1 },
      ];
    }

    case 'life4cuts-2x2': {
      // 2x2 grid with dedicated photobooth bottom caption area
      const photoAreaHeight = hasFooterStamp ? 86 : 90;
      const hHalf = photoAreaHeight / 2;
      return [
        { x: 2, y: 2, width: 47, height: hHalf - 1 },
        { x: 51, y: 2, width: 47, height: hHalf - 1 },
        { x: 2, y: 2 + hHalf, width: 47, height: hHalf - 1 },
        { x: 51, y: 2 + hHalf, width: 47, height: hHalf - 1 },
      ];
    }

    case 'editorial-hero': {
      // 1 Hero left (60%), right split into 2 or 3 (40%)
      const subCount = Math.max(1, safeCount - 1);
      const subHeight = 100 / subCount;
      const slots: LayoutSlot[] = [
        { x: 0, y: 0, width: 60, height: 100 }
      ];
      for (let i = 0; i < subCount; i++) {
        slots.push({
          x: 60,
          y: i * subHeight,
          width: 40,
          height: subHeight,
        });
      }
      return slots;
    }

    case 'editorial-sidebar': {
      // Hero top (58%), bottom row split into 3 (42%)
      const bottomCount = Math.max(1, safeCount - 1);
      const bottomWidth = 100 / bottomCount;
      const slots: LayoutSlot[] = [
        { x: 0, y: 0, width: 100, height: 58 }
      ];
      for (let i = 0; i < bottomCount; i++) {
        slots.push({
          x: i * bottomWidth,
          y: 58,
          width: bottomWidth,
          height: 42,
        });
      }
      return slots;
    }

    case 'polaroid-trio': {
      // 3 aesthetic polaroid frames (vertical stacks or columns)
      if (aspectRatio === '9:16' || aspectRatio === '3:4') {
        // Vertical stacked cards
        return [
          { x: 5, y: 3, width: 90, height: 30 },
          { x: 5, y: 35, width: 90, height: 30 },
          { x: 5, y: 67, width: 90, height: 30 },
        ];
      }
      // Horizontal columns
      return [
        { x: 3, y: 5, width: 30, height: 90 },
        { x: 35, y: 5, width: 30, height: 90 },
        { x: 67, y: 5, width: 30, height: 90 },
      ];
    }

    case 'asymmetric-split':
      return [
        { x: 0, y: 0, width: 62, height: 100 },
        { x: 62, y: 0, width: 38, height: 100 },
      ];

    case 'filmstrip': {
      const slotsCount = Math.max(3, safeCount);
      const stripWidth = 100 / slotsCount;
      return Array.from({ length: slotsCount }, (_, i) => ({
        x: i * stripWidth,
        y: 10,
        width: stripWidth,
        height: 80,
      }));
    }

    default:
      return computeAutoSlots(safeCount, aspectRatio);
  }
}

/**
 * Smart Auto Layout: Computes dynamic pleasant arrangement for any photo count (1 to 12+)
 */
function computeAutoSlots(count: number, aspectRatio: AspectRatio): LayoutSlot[] {
  if (count <= 1) {
    return [{ x: 0, y: 0, width: 100, height: 100 }];
  }

  if (count === 2) {
    if (aspectRatio === '9:16' || aspectRatio === '3:4') {
      return [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 0, y: 50, width: 100, height: 50 },
      ];
    }
    return [
      { x: 0, y: 0, width: 50, height: 100 },
      { x: 50, y: 0, width: 50, height: 100 },
    ];
  }

  if (count === 3) {
    // 1 Hero + 2 Stacked
    return [
      { x: 0, y: 0, width: 58, height: 100 },
      { x: 58, y: 0, width: 42, height: 50 },
      { x: 58, y: 50, width: 42, height: 50 },
    ];
  }

  if (count === 4) {
    // 2x2 grid
    return [
      { x: 0, y: 0, width: 50, height: 50 },
      { x: 50, y: 0, width: 50, height: 50 },
      { x: 0, y: 50, width: 50, height: 50 },
      { x: 50, y: 50, width: 50, height: 50 },
    ];
  }

  if (count === 5) {
    // Top 2, Bottom 3
    return [
      { x: 0, y: 0, width: 50, height: 50 },
      { x: 50, y: 0, width: 50, height: 50 },
      { x: 0, y: 50, width: 100 / 3, height: 50 },
      { x: 100 / 3, y: 50, width: 100 / 3, height: 50 },
      { x: (100 / 3) * 2, y: 50, width: 100 / 3, height: 50 },
    ];
  }

  if (count === 6) {
    // 3x2 grid
    return Array.from({ length: 6 }, (_, i) => ({
      x: (i % 3) * (100 / 3),
      y: Math.floor(i / 3) * 50,
      width: 100 / 3,
      height: 50,
    }));
  }

  if (count === 7 || count === 8) {
    // Top 4, Bottom 3 or 4
    const topCount = Math.ceil(count / 2);
    const bottomCount = count - topCount;
    const topWidth = 100 / topCount;
    const bottomWidth = 100 / bottomCount;

    const slots: LayoutSlot[] = [];
    for (let i = 0; i < topCount; i++) {
      slots.push({ x: i * topWidth, y: 0, width: topWidth, height: 50 });
    }
    for (let i = 0; i < bottomCount; i++) {
      slots.push({ x: i * bottomWidth, y: 50, width: bottomWidth, height: 50 });
    }
    return slots;
  }

  // 9 or more: 3x3 or NxM
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const colWidth = 100 / cols;
  const rowHeight = 100 / rows;

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: col * colWidth,
      y: row * rowHeight,
      width: colWidth,
      height: rowHeight,
    };
  });
}
