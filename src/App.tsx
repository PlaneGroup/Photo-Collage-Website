import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { photos } = useCollage();
  const { t } = useLanguage();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-studio-50 dark:bg-studio-950 text-studio-900 dark:text-studio-50 font-sans transition-colors duration-200">
      
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
