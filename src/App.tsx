import React, { useState, useRef, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CollageProvider, useCollage } from './context/CollageContext';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { CollageCanvas } from './components/CollageCanvas';
import { SidebarControls } from './components/SidebarControls';
import { ExportModal } from './components/ExportModal';
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Layers, 
  Heart,
  UploadCloud
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { photos, addPhotos } = useCollage();
  const { t } = useLanguage();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const dragCounter = useRef(0);

  // Prevent default browser behavior on window to avoid opening dragged image in new tab
  useEffect(() => {
    const preventDragDefaults = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', preventDragDefaults);
    window.addEventListener('drop', preventDragDefaults);

    return () => {
      window.removeEventListener('dragover', preventDragDefaults);
      window.removeEventListener('drop', preventDragDefaults);
    };
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        setIsDraggingFiles(true);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingFiles(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingFiles(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) {
        await addPhotos(files);
      }
    }
  };

  return (
    <div 
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative min-h-screen flex flex-col bg-studio-50 dark:bg-studio-950 text-studio-900 dark:text-studio-50 font-sans transition-colors duration-200"
    >
      
      {/* Global Drag-to-Add Overlay when dragging photos over existing collage */}
      {isDraggingFiles && photos.length > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-studio-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in p-6">
          <div className="relative p-8 sm:p-12 rounded-3xl border-3 border-dashed border-indigo-400 bg-indigo-500/10 flex flex-col items-center text-center shadow-glow max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 animate-bounce mb-5">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('editor.dragToAddTitle')}
            </h3>
            <p className="text-sm sm:text-base text-indigo-200 mt-2">
              {t('editor.dragToAddSubtitle')}
            </p>
            <div className="mt-5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('header.privacyBadge')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {photos.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-8 px-4">
            
            {/* Hero Title & Pitch */}
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('editor.heroBadge')}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-studio-900 dark:text-white leading-tight">
                {t('editor.heroTitlePrefix')}{' '}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t('editor.heroTitleHighlight')}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-studio-600 dark:text-studio-400 max-w-xl mx-auto">
                {t('editor.heroSubtitle')}
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <Dropzone />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-6 px-4 w-full">
              
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-studio-900/60 border border-studio-200/80 dark:border-studio-800/80 shadow-sm flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-studio-900 dark:text-white">
                    {t('editor.featureAutoTitle')}
                  </h4>
                  <p className="text-[11px] text-studio-500 dark:text-studio-400 mt-0.5">
                    {t('editor.featureAutoDesc')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-studio-900/60 border border-studio-200/80 dark:border-studio-800/80 shadow-sm flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-studio-900 dark:text-white">
                    {t('editor.featurePrivacyTitle')}
                  </h4>
                  <p className="text-[11px] text-studio-500 dark:text-studio-400 mt-0.5">
                    {t('editor.featurePrivacyDesc')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-studio-900/60 border border-studio-200/80 dark:border-studio-800/80 shadow-sm flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-studio-900 dark:text-white">
                    {t('editor.featurePhotoboothTitle')}
                  </h4>
                  <p className="text-[11px] text-studio-500 dark:text-studio-400 mt-0.5">
                    {t('editor.featurePhotoboothDesc')}
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row">
            
            {/* Center Canvas Preview Stage */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-studio-100/50 dark:bg-studio-950/60">
              <CollageCanvas />
            </div>

            {/* Right / Bottom Tool Controls Panel */}
            <SidebarControls />

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-studio-200 dark:border-studio-800/80 py-4 px-6 text-center text-xs text-studio-400 dark:text-studio-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <span>CollageCraft Studio</span>
          <span>•</span>
          <span className="text-emerald-500 flex items-center">
            <ShieldCheck className="w-3 h-3 mr-0.5 inline" /> {t('editor.footerZeroFootprint')}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>{t('editor.footerCraftedWith')}</span>
        </div>
      </footer>

      {/* Export High-Res Modal */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CollageProvider>
          <MainLayout />
        </CollageProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
