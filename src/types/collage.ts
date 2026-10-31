export interface PhotoItem {
  id: string;
  file?: File;
  url: string; // volatile in-memory object URL
  originalWidth: number;
  originalHeight: number;
  rotation: number; // 0, 90, 180, 270
  filterId: string;
  zoom: number; // 1 to 3
  offsetX: number; // percentage or px
  offsetY: number;
}

export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | '3:4' | '4:3';

export type LayoutId =
  | 'auto'
  | 'grid-1x2'
  | 'grid-2x1'
  | 'grid-2x2'
  | 'grid-3x2'
  | 'grid-2x3'
  | 'grid-3x3'
  | 'life4cuts-strip'
  | 'life4cuts-2x2'
  | 'editorial-hero'
  | 'editorial-sidebar'
  | 'polaroid-trio'
  | 'asymmetric-split'
  | 'filmstrip';

export interface LayoutSlot {
  x: number;      // 0 to 100 (%)
  y: number;      // 0 to 100 (%)
  width: number;  // 0 to 100 (%)
  height: number; // 0 to 100 (%)
}

export interface CanvasSettings {
  aspectRatio: AspectRatio;
  padding: number;       // outer padding (0 to 48px)
  gap: number;           // inner gap (0 to 32px)
  radius: number;        // corner radius (0 to 32px)
  bgType: 'solid' | 'gradient';
  bgColor: string;
  gradientPreset: string;
  textStamp: {
    enabled: boolean;
    text: string;
    subText?: string;
    fontStyle: 'modern' | 'serif' | 'typewriter' | 'handwriting';
    color: string;
    position: 'bottom' | 'top';
  };
}

export interface FilterPreset {
  id: string;
  name: string;
  filter: string;
  cssFilter: string;
}

export interface BackgroundPreset {
  id: string;
  nameKey: string;
  type: 'solid' | 'gradient';
  value: string; // hex or css linear-gradient
  textColor: string;
}
