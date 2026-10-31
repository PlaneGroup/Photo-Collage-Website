export interface FilterPreset {
  id: string;
  name: string;
  filter: string;
  cssFilter: string;
}

export declare const FILTER_PRESETS: FilterPreset[];

export declare function applyFilterToContext(ctx: CanvasRenderingContext2D, filterStr: string): void;
