import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCollage } from '../context/CollageContext';
import { UploadCloud, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react';

export const Dropzone: React.FC = () => {
  const { t } = useLanguage();
  const { addPhotos } = useCollage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await addPhotos(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await addPhotos(Array.from(e.target.files));
      e.target.value = ''; // reset so same files can be re-selected if needed
    }
  };

  /**
   * Generates vibrant aesthetic client-side demo images in memory
   * so user can immediately play with the collage maker in 1 click!
   */
  const handleLoadDemoPhotos = async () => {
    const demoGradients = [
      { text: 'Tokyo Nights', bg1: '#ff416c', bg2: '#ff4b2b', emoji: '🗼' },
      { text: 'Golden Hour', bg1: '#f857a6', bg2: '#ff5858', emoji: '🌇' },
      { text: 'Ocean Breeze', bg1: '#00c6ff', bg2: '#0072ff', emoji: '🌊' },
      { text: 'Neon Dream', bg1: '#7f00ff', bg2: '#e100ff', emoji: '✨' },
    ];

    const demoFiles: File[] = [];

    for (let i = 0; i < demoGradients.length; i++) {
      const { text, bg1, bg2, emoji } = demoGradients[i];
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d')!;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 1000);
      grad.addColorStop(0, bg1);
      grad.addColorStop(1, bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1000);

      // Aesthetic decor
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(400, 500, 240, 0, Math.PI * 2);
      ctx.fill();

      // Emoji & text
      ctx.fillStyle = '#ffffff';
      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 400, 440);

      ctx.font = 'bold 42px Inter, sans-serif';
      ctx.fillText(text, 400, 560);

      ctx.font = '500 24px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(`Sample Shot #${i + 1}`, 400, 620);

      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95));
      demoFiles.push(new File([blob], `demo-photo-${i + 1}.jpg`, { type: 'image/jpeg' }));
    }

    await addPhotos(demoFiles);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 sm:my-12 px-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01] shadow-glow'
            : 'border-studio-300 dark:border-studio-700/80 bg-white/70 dark:bg-studio-900/60 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:bg-studio-50/80 dark:hover:bg-studio-900/90 shadow-glass dark:shadow-glass-dark'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Text */}
        <h3 className="mt-5 text-xl sm:text-2xl font-bold text-studio-900 dark:text-white text-center">
          {t('editor.dropzoneTitle')}
        </h3>
        <p className="mt-1.5 text-sm sm:text-base text-studio-500 dark:text-studio-400 text-center">
          {t('editor.dropzoneSubtitle')}
        </p>

        {/* Formats & High Res */}
        <div className="mt-4 flex items-center space-x-2 text-xs text-studio-400 dark:text-studio-500">
          <ImageIcon className="w-4 h-4" />
          <span>{t('editor.dropzoneLimit')}</span>
        </div>

        {/* Privacy Highlight Badge */}
        <div className="mt-6 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('editor.privacyNotice')}</span>
        </div>

        {/* Or try demo button */}
        <div className="mt-6 pt-5 border-t border-studio-200 dark:border-studio-800 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs text-studio-400">Want to test right now?</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLoadDemoPhotos();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Photos (4 Shots)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
