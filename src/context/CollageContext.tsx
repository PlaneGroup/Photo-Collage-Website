import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { PhotoItem, CanvasSettings, LayoutId, LayoutSlot } from '../types/collage';
import { computeLayoutSlots } from '../utils/layoutEngine';

export interface CollageNotification {
  key: string;
  params?: Record<string, string | number>;
}

interface CollageContextType {
  photos: PhotoItem[];
  layoutId: LayoutId;
  settings: CanvasSettings;
  activeSlots: LayoutSlot[];
  selectedPhotoId: string | null;
  autoMessage: string | null;
  autoNotification: CollageNotification | null;
  setLayoutId: (id: LayoutId) => void;
  setSelectedPhotoId: (id: string | null) => void;
  updateSettings: (updates: Partial<CanvasSettings>) => void;
  addPhotos: (files: File[]) => Promise<void>;
  removePhoto: (id: string) => void;
  swapPhotos: (sourceId: string, targetId: string) => void;
  updatePhoto: (id: string, updates: Partial<PhotoItem>) => void;
  rotatePhoto: (id: string) => void;
  setPhotoFilter: (id: string, filterId: string) => void;
  shuffleLayout: () => void;
  resetCollage: () => void;
}

const DEFAULT_SETTINGS: CanvasSettings = {
  aspectRatio: '1:1',
  padding: 18,
  gap: 12,
  radius: 12,
  bgType: 'solid',
  bgColor: '#ffffff',
  gradientPreset: 'Sunset',
  textStamp: {
    enabled: false,
    text: 'MEMORIES 2026',
    fontStyle: 'modern',
    color: '#ffffff',
    position: 'bottom',
  },
};

const CollageContext = createContext<CollageContextType | undefined>(undefined);

export const CollageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [layoutId, setLayoutId] = useState<LayoutId>('auto');
  const [settings, setSettings] = useState<CanvasSettings>(DEFAULT_SETTINGS);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [autoMessage, setAutoMessage] = useState<string | null>(null);
  const [autoNotification, setAutoNotification] = useState<CollageNotification | null>(null);

  // Compute active slots reactively
  const activeSlots = computeLayoutSlots(
    layoutId,
    photos.length,
    settings.aspectRatio,
    settings.textStamp.enabled
  );

  const updateSettings = useCallback((updates: Partial<CanvasSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      textStamp: updates.textStamp ? { ...prev.textStamp, ...updates.textStamp } : prev.textStamp,
    }));
  }, []);

  const addPhotos = useCallback(async (files: File[]) => {
    if (!files.length) return;

    const newItems: PhotoItem[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      // Volatile in-memory URL (zero server persistence)
      const url = URL.createObjectURL(file);

      // Measure original dimensions
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 800 });
        img.onerror = () => resolve({ width: 800, height: 800 });
        img.src = url;
      });

      newItems.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        url,
        originalWidth: width,
        originalHeight: height,
        rotation: 0,
        filterId: 'normal',
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      });
    }

    setPhotos((prev) => {
      const merged = [...prev, ...newItems];

      // Auto-tune aspect ratio or template for special photo counts
      if (prev.length === 0 && merged.length === 4) {
        setLayoutId('auto');
      } else if (prev.length > 0) {
        // If photos were added, adapt layout if current template doesn't fit all photos
        setLayoutId((curr) => {
          if (curr === 'auto') return 'auto';
          const slots = computeLayoutSlots(curr, prev.length, settings.aspectRatio);
          if (merged.length > slots.length) {
            return 'auto';
          }
          return curr;
        });
      }

      if (prev.length === 0) {
        setAutoNotification({ key: 'editor.autoCollageNotice', params: { count: merged.length } });
        setAutoMessage(`Auto-collage generated for ${merged.length} photos!`);
      } else {
        setAutoNotification({ key: 'editor.photosAddedNotice', params: { count: newItems.length } });
        setAutoMessage(`Added ${newItems.length} photos!`);
      }

      setTimeout(() => {
        setAutoMessage(null);
        setAutoNotification(null);
      }, 3500);

      return merged;
    });
  }, [settings.aspectRatio]);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((p) => p.id !== id);
    });
    setSelectedPhotoId((curr) => (curr === id ? null : curr));
  }, []);

  const swapPhotos = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setPhotos((prev) => {
      const sIndex = prev.findIndex((p) => p.id === sourceId);
      const tIndex = prev.findIndex((p) => p.id === targetId);
      if (sIndex === -1 || tIndex === -1) return prev;

      const next = [...prev];
      const temp = next[sIndex];
      next[sIndex] = next[tIndex];
      next[tIndex] = temp;
      return next;
    });
  }, []);

  const updatePhoto = useCallback((id: string, updates: Partial<PhotoItem>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const rotatePhoto = useCallback((id: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextRotation = ((p.rotation + 90) % 360);
        return { ...p, rotation: nextRotation };
      })
    );
  }, []);

  const setPhotoFilter = useCallback((id: string, filterId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, filterId } : p))
    );
  }, []);

  const shuffleLayout = useCallback(() => {
    setPhotos((prev) => {
      if (prev.length <= 1) return prev;
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

  const resetCollage = useCallback(() => {
    photos.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });
    setPhotos([]);
    setLayoutId('auto');
    setSelectedPhotoId(null);
  }, [photos]);

  // Cleanup all memory URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, []);

  return (
    <CollageContext.Provider
      value={{
        photos,
        layoutId,
        settings,
        activeSlots,
        selectedPhotoId,
        autoMessage,
        autoNotification,
        setLayoutId,
        setSelectedPhotoId,
        updateSettings,
        addPhotos,
        removePhoto,
        swapPhotos,
        updatePhoto,
        rotatePhoto,
        setPhotoFilter,
        shuffleLayout,
        resetCollage,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

export const useCollage = (): CollageContextType => {
  const context = useContext(CollageContext);
  if (!context) {
    throw new Error('useCollage must be used within a CollageProvider');
  }
  return context;
};
