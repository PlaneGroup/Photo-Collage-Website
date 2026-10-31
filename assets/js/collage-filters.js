/**
 * Client-Side Image Filter Presets & Processing Utilities
 * Executes strictly in-memory within HTML5 Canvas Context.
 * ZERO server communication or image persistence.
 */

export const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', filter: 'none', cssFilter: 'none' },
  { id: 'mono', name: 'Monochrome', filter: 'grayscale(100%)', cssFilter: 'grayscale(100%)' },
  { id: 'noir', name: 'Film Noir', filter: 'grayscale(100%) contrast(140%) brightness(90%)', cssFilter: 'grayscale(100%) contrast(1.4) brightness(0.9)' },
  { id: 'warm', name: 'Warm Sunset', filter: 'sepia(25%) saturate(130%) brightness(105%)', cssFilter: 'sepia(0.25) saturate(1.3) brightness(1.05)' },
  { id: 'cool', name: 'Nordic Cool', filter: 'saturate(90%) hue-rotate(180deg) brightness(102%)', cssFilter: 'saturate(0.9) hue-rotate(180deg) brightness(1.02)' },
  { id: 'vintage', name: 'Vintage 90s', filter: 'sepia(40%) contrast(115%) brightness(95%)', cssFilter: 'sepia(0.4) contrast(1.15) brightness(0.95)' },
  { id: 'vivid', name: 'Vivid Pop', filter: 'contrast(120%) saturate(160%)', cssFilter: 'contrast(1.2) saturate(1.6)' },
  { id: 'fade', name: 'Moody Fade', filter: 'contrast(85%) brightness(110%) saturate(85%)', cssFilter: 'contrast(0.85) brightness(1.1) saturate(0.85)' },
  { id: 'retro-polaroid', name: 'Retro Polaroid', filter: 'sepia(20%) contrast(110%) brightness(105%) saturate(120%)', cssFilter: 'sepia(0.2) contrast(1.1) brightness(1.05) saturate(1.2)' }
];

/**
 * Apply CSS filter string to canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} filterStr 
 */
export function applyFilterToContext(ctx, filterStr) {
  if (!ctx) return;
  if (filterStr && filterStr !== 'none') {
    ctx.filter = filterStr;
  } else {
    ctx.filter = 'none';
  }
}
