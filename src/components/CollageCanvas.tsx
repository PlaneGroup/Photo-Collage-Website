import React, { useState } from 'react';
import { useCollage } from '../context/CollageContext';
import { useLanguage } from '../context/LanguageContext';
import { ASPECT_RATIOS } from '../utils/layoutEngine';
import { FILTER_PRESETS } from '../../assets/js/collage-filters';
import { 
  RotateCw, 
  Trash2, 
  SlidersHorizontal, 
  Sparkles,
  Move
} from 'lucide-react';

export const CollageCanvas: React.FC = () => {
  const { 
    photos, 
    settings, 
    activeSlots, 
    autoMessage,
    swapPhotos, 
    rotatePhoto, 
    setPhotoFilter, 
    updatePhoto,
    removePhoto 
  } = useCollage();
  const { t } = useLanguage();

  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [activeFilterMenuId, setActiveFilterMenuId] = useState<string | null>(null);

  const aspectRatioInfo = ASPECT_RATIOS[settings.aspectRatio] || ASPECT_RATIOS['1:1'];

  // Background styling
  const canvasBgStyle: React.CSSProperties = {
    background: settings.bgType === 'gradient' ? settings.gradientPreset : settings.bgColor,
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedPhotoId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedPhotoId;
    if (sourceId && sourceId !== targetId) {
      swapPhotos(sourceId, targetId);
    }
    setDraggedPhotoId(null);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 sm:p-8">
      
      {/* Auto-Collage Notification Banner */}
      {autoMessage && (
        <div className="absolute top-2 z-30 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{autoMessage}</span>
        </div>
      )}

      {/* Main Canvas Frame */}
      <div 
        className="relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-black/10 dark:border-white/10"
        style={{
          aspectRatio: `${aspectRatioInfo.ratio}`,
          ...canvasBgStyle,
          padding: `${settings.padding}px`,
        }}
      >
        {/* Collage Slots Container */}
        <div className="relative w-full h-full">
          {activeSlots.map((slot, index) => {
            const photo = photos[index];
            if (!photo) return null;

            const filterPreset = FILTER_PRESETS.find((f) => f.id === photo.filterId);
            const isFilterOpen = activeFilterMenuId === photo.id;

            // Half-gap inset
            const halfGap = settings.gap / 2;

            return (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, photo.id)}
                className={`group absolute overflow-hidden select-none transition-shadow ${
                  draggedPhotoId === photo.id ? 'opacity-40 ring-2 ring-indigo-500 ring-offset-2' : ''
                }`}
                style={{
                  left: `calc(${slot.x}% + ${halfGap}px)`,
                  top: `calc(${slot.y}% + ${halfGap}px)`,
                  width: `calc(${slot.width}% - ${settings.gap}px)`,
                  height: `calc(${slot.height}% - ${settings.gap}px)`,
                  borderRadius: `${settings.radius}px`,
                }}
              >
                {/* Photo Image Element */}
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-studio-100 dark:bg-studio-800">
                  <img
                    src={photo.url}
                    alt={`Collage Item ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 pointer-events-none"
                    style={{
                      transform: `rotate(${photo.rotation}deg) scale(${photo.zoom}) translate(${photo.offsetX}px, ${photo.offsetY}px)`,
                      filter: filterPreset?.cssFilter || 'none',
                    }}
                  />

                  {/* Drag Handle Indicator on Hover */}
                  <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md cursor-grab active:cursor-grabbing">
                    <Move className="w-3.5 h-3.5" />
                  </div>

                  {/* Quick Action Floating Bar on Hover */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    
                    {/* Rotate button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotatePhoto(photo.id);
                      }}
                      title={t('editor.rotatePhoto')}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Filter button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterMenuId(isFilterOpen ? null : photo.id);
                      }}
                      title={t('editor.filterPhoto')}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
                        isFilterOpen ? 'bg-indigo-600 text-white' : 'bg-black/60 hover:bg-black/80 text-white'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* Zoom In/Out quick toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextZoom = photo.zoom >= 1.6 ? 1 : Number((photo.zoom + 0.3).toFixed(1));
                        updatePhoto(photo.id, { zoom: nextZoom });
                      }}
                      title="Toggle Zoom"
                      className="px-1.5 py-0.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold backdrop-blur-md"
                    >
                      {photo.zoom > 1 ? `${photo.zoom}x` : '1x'}
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      title={t('editor.removePhoto')}
                      className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Filter Dropdown Popover */}
                  {isFilterOpen && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 text-white z-30 flex flex-wrap gap-1.5 justify-center max-h-36 overflow-y-auto animate-fade-in"
                    >
                      {FILTER_PRESETS.map((fp) => (
                        <button
                          key={fp.id}
                          onClick={() => {
                            setPhotoFilter(photo.id, fp.id);
                            setActiveFilterMenuId(null);
                          }}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                            photo.filterId === fp.id
                              ? 'bg-indigo-500 text-white'
                              : 'bg-white/10 hover:bg-white/25 text-white/90'
                          }`}
                        >
                          {t(`common.filters.${fp.id}`) || fp.name}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Aesthetic Text / Photobooth Date Stamp Overlay */}
        {settings.textStamp && settings.textStamp.enabled && settings.textStamp.text && (
          <div 
            className={`absolute left-0 right-0 text-center tracking-widest font-semibold uppercase pointer-events-none drop-shadow-md transition-all ${
              settings.textStamp.position === 'top' ? 'top-3' : 'bottom-3'
            }`}
            style={{
              color: settings.textStamp.color || '#ffffff',
              fontFamily:
                settings.textStamp.fontStyle === 'serif'
                  ? 'serif'
                  : settings.textStamp.fontStyle === 'typewriter'
                  ? 'monospace'
                  : settings.textStamp.fontStyle === 'handwriting'
                  ? 'cursive'
                  : 'Inter, sans-serif',
              fontSize: 'clamp(12px, 2.5vw, 20px)',
            }}
          >
            {settings.textStamp.text}
          </div>
        )}
      </div>

      {/* Helpful Hint beneath Canvas */}
      <p className="mt-3 text-xs text-studio-400 dark:text-studio-500 text-center">
        💡 {t('editor.swapInstruction')}
      </p>

    </div>
  );
};
