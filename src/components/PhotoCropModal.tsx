import React, { useState, useEffect, useRef } from 'react';
import { PhotoItem } from '../types/collage';
import { useLanguage } from '../context/LanguageContext';
import { FILTER_PRESETS } from '../../assets/js/collage-filters';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Move,
  ArrowUpDown,
  ArrowLeftRight
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  photo: PhotoItem | null;
  slotAspectRatio: number; // width / height of target slot
  onClose: () => void;
  onApply: (updated: { offsetX: number; offsetY: number; zoom: number; rotation: number }) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  photo,
  slotAspectRatio,
  onClose,
  onApply,
}) => {
  const { t } = useLanguage();

  // offsetX: -50 (show left) to +50 (show right), 0 is centered
  // offsetY: -50 (show top) to +50 (show bottom), 0 is centered
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 });
  const frameContainerRef = useRef<HTMLDivElement>(null);

  // Initialize state when modal opens or photo changes
  useEffect(() => {
    if (photo && isOpen) {
      setOffsetX(photo.offsetX || 0);
      setOffsetY(photo.offsetY || 0);
      setZoom(photo.zoom || 1);
      setRotation(photo.rotation || 0);
    }
  }, [photo, isOpen]);

  if (!isOpen || !photo) return null;

  const filterPreset = FILTER_PRESETS.find((f) => f.id === photo.filterId);

  // Calculate box dimensions to preserve EXACT slot aspect ratio
  const maxStageWidth = 520;
  const maxStageHeight = 380;

  let boxWidth: number;
  let boxHeight: number;

  const safeRatio = slotAspectRatio > 0 ? slotAspectRatio : 1;

  if (safeRatio >= 1) {
    boxWidth = Math.min(maxStageWidth, maxStageHeight * safeRatio);
    boxHeight = boxWidth / safeRatio;
  } else {
    boxHeight = Math.min(maxStageHeight, maxStageWidth / safeRatio);
    boxWidth = boxHeight * safeRatio;
  }

  // Pointer drag handlers: dragging on photo adjusts position directly
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Account for rotation angle
    const rad = (-rotation * Math.PI) / 180;
    const rotDeltaX = deltaX * Math.cos(rad) - deltaY * Math.sin(rad);
    const rotDeltaY = deltaX * Math.sin(rad) + deltaY * Math.cos(rad);

    // Dragging down moves offsetY up towards +50 (showing bottom)
    // Moving 1px corresponds to percentage adjustment
    const sensitivity = 0.35;
    const nextX = dragStartRef.current.startOffsetX - rotDeltaX * sensitivity;
    const nextY = dragStartRef.current.startOffsetY - rotDeltaY * sensitivity;

    setOffsetX(Math.max(-50, Math.min(50, Math.round(nextX * 10) / 10)));
    setOffsetY(Math.max(-50, Math.min(50, Math.round(nextY * 10) / 10)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setOffsetX(0);
    setOffsetY(0);
    setZoom(1);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    onApply({
      offsetX,
      offsetY,
      zoom,
      rotation,
    });
    onClose();
  };

  // Convert -50..+50 to CSS object-position percentage (0% to 100%)
  const objectPositionX = 50 + offsetX;
  const objectPositionY = 50 + offsetY;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-studio-900 rounded-3xl shadow-2xl border border-studio-200 dark:border-studio-800 overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-studio-200 dark:border-studio-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-studio-900 dark:text-white">
                {t('crop.modalTitle')}
              </h3>
              <p className="text-xs text-studio-500 dark:text-studio-400">
                {t('crop.modalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-studio-400 hover:text-studio-700 dark:hover:text-white hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport & Crop Framing Stage */}
        <div className="relative flex-1 bg-studio-100 dark:bg-studio-950/90 p-6 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
          
          {/* Exact Aspect Ratio Crop Frame */}
          <div
            ref={frameContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              aspectRatio: `${safeRatio}`,
            }}
            className={`relative overflow-hidden rounded-2xl shadow-2xl border-2 transition-shadow cursor-grab active:cursor-grabbing ${
              isDragging
                ? 'border-indigo-500 ring-4 ring-indigo-500/30'
                : 'border-white/80 dark:border-white/20 hover:border-indigo-400'
            }`}
          >
            {/* The photo rendered using object-position: guarantees full cover without empty gaps */}
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-studio-200 dark:bg-studio-900">
              <img
                src={photo.url}
                alt="Reposition Preview"
                draggable={false}
                className="w-full h-full pointer-events-none select-none transition-transform duration-75"
                style={{
                  objectFit: 'cover',
                  objectPosition: `${objectPositionX}% ${objectPositionY}%`,
                  transform: rotation || zoom > 1 
                    ? `rotate(${rotation}deg) scale(${zoom})`
                    : undefined,
                  transformOrigin: `${objectPositionX}% ${objectPositionY}%`,
                  filter: filterPreset?.cssFilter || 'none',
                }}
              />
            </div>

            {/* Rule of Thirds Grid overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Interactive hint badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none flex items-center space-x-1.5 opacity-90 shadow-sm">
              <Move className="w-3 h-3 text-indigo-400" />
              <span>{t('crop.dragHint')}</span>
            </div>

          </div>

          {/* Aspect ratio indicator */}
          <div className="mt-3 text-[11px] font-mono text-studio-400 dark:text-studio-500">
            Slot Aspect Ratio: {safeRatio.toFixed(2)} : 1
          </div>

        </div>

        {/* Framing Controls Bar */}
        <div className="p-5 border-t border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 space-y-3.5">
          
          {/* Vertical Position Slider (Up / Down) */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-studio-700 dark:text-studio-300 w-36 flex items-center space-x-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('crop.verticalPosition')}</span>
            </span>
            <span className="text-[11px] text-studio-400 w-12 text-right">Top</span>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-[11px] text-studio-400 w-12">Bottom</span>
          </div>

          {/* Horizontal Position Slider (Left / Right) */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-studio-700 dark:text-studio-300 w-36 flex items-center space-x-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('crop.horizontalPosition')}</span>
            </span>
            <span className="text-[11px] text-studio-400 w-12 text-right">Left</span>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-[11px] text-studio-400 w-12">Right</span>
          </div>

          {/* Zoom Level Slider */}
          <div className="flex items-center space-x-3 pt-1">
            <span className="text-xs font-semibold text-studio-700 dark:text-studio-300 w-36 flex items-center space-x-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('crop.zoomLabel')} ({zoom.toFixed(2)}x)</span>
            </span>
            <button
              onClick={() => setZoom((prev) => Math.max(1, Math.round((prev - 0.1) * 10) / 10))}
              className="p-1 rounded-lg text-studio-400 hover:text-studio-700 dark:hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => setZoom((prev) => Math.min(2.5, Math.round((prev + 0.1) * 10) / 10))}
              className="p-1 rounded-lg text-studio-400 hover:text-studio-700 dark:hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-studio-100 dark:border-studio-800">
            
            <div className="flex items-center space-x-2">
              {/* Reset Framing Button */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-studio-200 dark:border-studio-700 text-xs font-semibold text-studio-600 dark:text-studio-300 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('crop.resetButton')}</span>
              </button>

              {/* Rotate Button */}
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-studio-200 dark:border-studio-700 text-xs font-semibold text-studio-600 dark:text-studio-300 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t('crop.rotateButton')}</span>
              </button>
            </div>

            {/* Cancel & Apply */}
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-studio-500 hover:text-studio-900 dark:hover:text-white transition-colors"
              >
                {t('crop.cancelButton')}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-102 active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>{t('crop.applyButton')}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
