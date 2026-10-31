import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCollage } from '../context/CollageContext';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Download, 
  RotateCcw,
  Globe
} from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { photos, resetCollage } = useCollage();

  const handleReset = () => {
    if (photos.length > 0) {
      if (window.confirm(t('header.resetConfirm'))) {
        resetCollage();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t('header.brandName')}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" title={t('header.privacyTooltip')}>
                <ShieldCheck className="w-3 h-3 mr-1" />
                {t('header.privacyBadge')}
              </span>
            </div>
            <p className="hidden md:block text-xs text-studio-500 dark:text-studio-400 -mt-0.5">
              {t('header.brandTagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-studio-100 dark:bg-studio-900 rounded-lg p-0.5 border border-studio-200 dark:border-studio-800">
            <Globe className="w-3.5 h-3.5 ml-2 text-studio-400" />
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'EN'
                  ? 'bg-white dark:bg-studio-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-studio-600 dark:text-studio-400 hover:text-studio-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('KO')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'KO'
                  ? 'bg-white dark:bg-studio-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-studio-600 dark:text-studio-400 hover:text-studio-900 dark:hover:text-white'
              }`}
            >
              KO
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('header.themeToggleLight') : t('header.themeToggleDark')}
            title={theme === 'dark' ? t('header.themeToggleLight') : t('header.themeToggleDark')}
            className="p-2 rounded-lg text-studio-600 dark:text-studio-300 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Reset Collage Button */}
          {photos.length > 0 && (
            <button
              onClick={handleReset}
              title={t('header.newCollageButton')}
              className="p-2 rounded-lg text-studio-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Export Action Button */}
          <button
            onClick={onOpenExport}
            disabled={photos.length === 0}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              photos.length > 0
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-studio-200 dark:bg-studio-800 text-studio-400 dark:text-studio-600 cursor-not-allowed opacity-60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{t('header.exportButton')}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
