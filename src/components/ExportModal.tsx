import React, { useState, useEffect, useRef } from 'react';
import { useCollage } from '../context/CollageContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  renderCollageToCanvas, 
  downloadCanvasImage, 
  copyCanvasToClipboard 
} from '../utils/canvasExporter';
import { ASPECT_RATIOS } from '../utils/layoutEngine';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Loader2 
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { photos, activeSlots, settings } = useCollage();
  const { t } = useLanguage();

  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [scale, setScale] = useState<number>(2); // 2x default for ultra HD
  const [isRendering, setIsRendering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseDim = ASPECT_RATIOS[settings.aspectRatio] || ASPECT_RATIOS['1:1'];
  const exportWidth = baseDim.width * scale;
  const exportHeight = baseDim.height * scale;

  // Generate preview when modal opens or settings change
  useEffect(() => {
    if (!isOpen || photos.length === 0) return;

    let isMounted = true;
    setIsRendering(true);

    renderCollageToCanvas({
      photos,
      slots: activeSlots,
      settings,
      scale: 1, // 1x scale for fast modal preview
    })
      .then((canvas) => {
        if (!isMounted) return;
        canvasRef.current = canvas;
        const url = canvas.toDataURL('image/png');
        setPreviewUrl(url);
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Failed to render export preview:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, photos, activeSlots, settings]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsRendering(true);
      // Render at chosen scale (1x or 2x)
      const exportCanvas = await renderCollageToCanvas({
        photos,
        slots: activeSlots,
        settings,
        scale,
      });

      await downloadCanvasImage(exportCanvas, format, 'collagecraft-art');
      setIsRendering(false);
    } catch (err) {
      console.error('Download error:', err);
      setIsRendering(false);
    }
  };

  const handleCopy = async () => {
    try {
      setIsRendering(true);
      const exportCanvas = await renderCollageToCanvas({
        photos,
        slots: activeSlots,
        settings,
        scale: 1, // clipboard typically best at standard scale
      });

      const success = await copyCanvasToClipboard(exportCanvas);
      setIsRendering(false);

      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 3000);
      }
    } catch (err) {
      console.error('Copy error:', err);
      setIsRendering(false);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-studio-900 rounded-3xl shadow-2xl border border-studio-200 dark:border-studio-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-studio-200 dark:border-studio-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-studio-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>{t('export.exportTitle')}</span>
            </h3>
            <p className="text-xs text-studio-500 dark:text-studio-400 mt-0.5">
              {t('export.exportSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-studio-400 hover:text-studio-700 dark:hover:text-white hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Canvas Image Preview */}
          <div className="relative w-full max-h-72 rounded-2xl bg-studio-100 dark:bg-studio-950 flex items-center justify-center overflow-hidden border border-studio-200 dark:border-studio-800">
            {isRendering && !previewUrl ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2 text-indigo-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-semibold">{t('export.preparing')}</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Collage Preview"
                className="max-h-72 max-w-full object-contain drop-shadow-md"
              />
            ) : null}

            {/* Resolution pill indicator */}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
              {exportWidth} × {exportHeight} px
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Format Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500 mb-2">
                {t('export.formatLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                      format === fmt
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-studio-200 dark:border-studio-800 text-studio-700 dark:text-studio-300 hover:border-studio-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution & Scale Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500 mb-2">
                {t('export.scaleLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScale(1)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    scale === 1
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-studio-200 dark:border-studio-800 text-studio-700 dark:text-studio-300 hover:border-studio-300'
                  }`}
                >
                  {t('export.scaleStandard')}
                </button>
                <button
                  onClick={() => setScale(2)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    scale === 2
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-studio-200 dark:border-studio-800 text-studio-700 dark:text-studio-300 hover:border-studio-300'
                  }`}
                >
                  {t('export.scaleRetina')}
                </button>
              </div>
            </div>

          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{t('export.privacyFootnote')}</span>
          </div>

          {/* Copy feedback message */}
          {copyError && (
            <p className="text-xs text-rose-500 text-center animate-fade-in">
              {t('export.copyFailed')}
            </p>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-studio-50/70 dark:bg-studio-950/60 border-t border-studio-200 dark:border-studio-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-studio-600 dark:text-studio-400 hover:text-studio-900 dark:hover:text-white transition-colors"
          >
            {t('common.close')}
          </button>

          <button
            onClick={handleCopy}
            disabled={isRendering}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-studio-300 dark:border-studio-700 bg-white dark:bg-studio-800 hover:bg-studio-50 dark:hover:bg-studio-700 text-studio-700 dark:text-studio-200 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">{t('export.copySuccess')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t('export.copyButton')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={isRendering}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {isRendering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{t('export.downloadButton')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
