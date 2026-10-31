import React, { useState, useRef } from 'react';
import { useCollage } from '../context/CollageContext';
import { useLanguage } from '../context/LanguageContext';
import { LAYOUT_PRESETS, BACKGROUND_PRESETS, ASPECT_RATIOS } from '../utils/layoutEngine';
import { AspectRatio, LayoutId } from '../types/collage';
import { 
  LayoutGrid, 
  Palette, 
  Type, 
  Plus, 
  Shuffle, 
  Sliders, 
  Layers
} from 'lucide-react';

type Tab = 'layout' | 'design' | 'text';

export const SidebarControls: React.FC = () => {
  const { 
    photos, 
    layoutId, 
    setLayoutId, 
    settings, 
    updateSettings, 
    addPhotos, 
    shuffleLayout 
  } = useCollage();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<Tab>('layout');
  const [layoutCategory, setLayoutCategory] = useState<'all' | 'grid' | 'trendy' | 'photobooth'>('all');
  const addFilesInputRef = useRef<HTMLInputElement>(null);

  const filteredLayouts = LAYOUT_PRESETS.filter((p) => {
    if (layoutCategory === 'all') return true;
    return p.category === layoutCategory;
  });

  const handleAddMoreFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await addPhotos(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <aside className="w-full lg:w-96 flex flex-col bg-white dark:bg-studio-900 border-t lg:border-t-0 lg:border-l border-studio-200 dark:border-studio-800 transition-colors">
      
      {/* Top Tabs */}
      <div className="flex border-b border-studio-200 dark:border-studio-800 bg-studio-50/50 dark:bg-studio-950/40 p-1.5">
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'layout'
              ? 'bg-white dark:bg-studio-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-studio-500 hover:text-studio-900 dark:hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t('presets.layoutsTitle')}</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'design'
              ? 'bg-white dark:bg-studio-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-studio-500 hover:text-studio-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>{t('editor.canvasSettings')}</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'text'
              ? 'bg-white dark:bg-studio-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-studio-500 hover:text-studio-900 dark:hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>{t('editor.textStamp')}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        
        {/* --- TAB 1: LAYOUT & RATIO --- */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            
            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500 mb-2.5">
                {t('editor.aspectRatio')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((ar) => (
                  <button
                    key={ar}
                    onClick={() => updateSettings({ aspectRatio: ar })}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      settings.aspectRatio === ar
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-studio-200 dark:border-studio-800 hover:border-studio-300 dark:hover:border-studio-700 text-studio-700 dark:text-studio-300'
                    }`}
                  >
                    <span className="block font-bold">{ar}</span>
                    <span className="text-[10px] opacity-75">{t(ASPECT_RATIOS[ar].labelKey).split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Filter Categories */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500">
                  {t('presets.layoutsTitle')}
                </label>
                <span className="text-xs font-medium text-studio-400">
                  {photos.length} {t('editor.photoCount', { count: photos.length })}
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex space-x-1.5 mb-3 overflow-x-auto pb-1">
                {(['all', 'trendy', 'photobooth', 'grid'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLayoutCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      layoutCategory === cat
                        ? 'bg-studio-900 text-white dark:bg-white dark:text-studio-900'
                        : 'bg-studio-100 dark:bg-studio-800 text-studio-600 dark:text-studio-400 hover:bg-studio-200 dark:hover:bg-studio-700'
                    }`}
                  >
                    {cat === 'all' && t('presets.categoryAll')}
                    {cat === 'trendy' && t('presets.categoryTrendy')}
                    {cat === 'photobooth' && t('presets.categoryPhotobooth')}
                    {cat === 'grid' && t('presets.categoryGrid')}
                  </button>
                ))}
              </div>

              {/* Layout Presets Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {filteredLayouts.map((preset) => {
                  const isSelected = layoutId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setLayoutId(preset.id as LayoutId)}
                      className={`relative p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'border-studio-200 dark:border-studio-800 hover:border-studio-300 dark:hover:border-studio-700 text-studio-800 dark:text-studio-200 bg-studio-50/40 dark:bg-studio-900/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Layers className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-studio-400'}`} />
                        <span className="text-xs font-bold truncate">
                          {t(preset.nameKey)}
                        </span>
                      </div>
                      <span className="text-[10px] text-studio-400 dark:text-studio-500">
                        Fits {preset.recommendedPhotos} photos
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: DESIGN & SLIDERS --- */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            
            {/* Spacing & Radius Sliders */}
            <div className="space-y-4">
              <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500">
                <Sliders className="w-3.5 h-3.5" />
                <span>{t('editor.spacingAndRadius')}</span>
              </label>

              {/* Outer Margin Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-studio-700 dark:text-studio-300">
                  <span>{t('editor.outerPadding')}</span>
                  <span className="text-studio-400">{settings.padding}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="44"
                  value={settings.padding}
                  onChange={(e) => updateSettings({ padding: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Inner Gap Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-studio-700 dark:text-studio-300">
                  <span>{t('editor.innerGap')}</span>
                  <span className="text-studio-400">{settings.gap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={settings.gap}
                  onChange={(e) => updateSettings({ gap: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Corner Radius Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-studio-700 dark:text-studio-300">
                  <span>{t('editor.cornerRadius')}</span>
                  <span className="text-studio-400">{settings.radius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={settings.radius}
                  onChange={(e) => updateSettings({ radius: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Background Color & Gradient Presets */}
            <div className="space-y-3 pt-3 border-t border-studio-200 dark:border-studio-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-studio-400 dark:text-studio-500">
                {t('editor.backgroundStyle')}
              </label>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_PRESETS.map((bp) => {
                  const isActive =
                    bp.type === 'gradient'
                      ? settings.bgType === 'gradient' && settings.gradientPreset === bp.value
                      : settings.bgType === 'solid' && settings.bgColor.toLowerCase() === bp.value.toLowerCase();

                  return (
                    <button
                      key={bp.id}
                      onClick={() => {
                        if (bp.type === 'gradient') {
                          updateSettings({ bgType: 'gradient', gradientPreset: bp.value });
                        } else {
                          updateSettings({ bgType: 'solid', bgColor: bp.value });
                        }
                      }}
                      title={t(bp.nameKey) || bp.nameKey}
                      className={`relative h-11 rounded-xl border flex items-center justify-center transition-all overflow-hidden ${
                        isActive
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105 shadow-md'
                          : 'border-studio-200 dark:border-studio-700 hover:scale-102'
                      }`}
                      style={{ background: bp.value }}
                    >
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm ring-1 ring-black/20" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Solid Color Picker */}
              <div className="pt-2 flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => updateSettings({ bgType: 'solid', bgColor: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-studio-300 dark:border-studio-700 bg-transparent"
                />
                <span className="text-xs text-studio-600 dark:text-studio-300 font-medium">
                  {t('editor.bgCustom')} ({settings.bgColor})
                </span>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: TEXT & STAMP --- */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            
            {/* Enable Stamp Switch */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-studio-50 dark:bg-studio-950/60 border border-studio-200 dark:border-studio-800">
              <span className="text-xs font-semibold text-studio-800 dark:text-studio-200">
                {t('editor.enableStamp')}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateSettings({
                    textStamp: { ...settings.textStamp, enabled: !settings.textStamp.enabled },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.textStamp.enabled ? 'bg-indigo-600' : 'bg-studio-300 dark:bg-studio-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.textStamp.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.textStamp.enabled && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Text String Input */}
                <div>
                  <label className="block text-xs font-medium text-studio-600 dark:text-studio-400 mb-1.5">
                    Stamp Text
                  </label>
                  <input
                    type="text"
                    value={settings.textStamp.text}
                    onChange={(e) =>
                      updateSettings({
                        textStamp: { ...settings.textStamp, text: e.target.value },
                      })
                    }
                    placeholder={t('editor.stampPlaceholder')}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-studio-200 dark:border-studio-700 bg-white dark:bg-studio-800 text-studio-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Font Typography Style */}
                <div>
                  <label className="block text-xs font-medium text-studio-600 dark:text-studio-400 mb-1.5">
                    {t('editor.stampFont')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['modern', 'serif', 'typewriter', 'handwriting'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() =>
                          updateSettings({
                            textStamp: { ...settings.textStamp, fontStyle: style },
                          })
                        }
                        className={`px-3 py-2 text-xs rounded-xl border text-center font-medium transition-all ${
                          settings.textStamp.fontStyle === style
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            : 'border-studio-200 dark:border-studio-800 text-studio-700 dark:text-studio-300 hover:border-studio-300'
                        }`}
                      >
                        {t(`common.fontStyles.${style}`) || style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Color Selection */}
                <div>
                  <label className="block text-xs font-medium text-studio-600 dark:text-studio-400 mb-1.5">
                    {t('editor.stampColor')}
                  </label>
                  <div className="flex items-center space-x-2">
                    {['#ffffff', '#0f1115', '#f59e0b', '#ec4899', '#6366f1'].map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          updateSettings({
                            textStamp: { ...settings.textStamp, color: c },
                          })
                        }
                        className={`w-7 h-7 rounded-full border border-black/10 transition-transform ${
                          settings.textStamp.color === c ? 'scale-125 ring-2 ring-indigo-500' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Position: Top or Bottom */}
                <div>
                  <label className="block text-xs font-medium text-studio-600 dark:text-studio-400 mb-1.5">
                    Position
                  </label>
                  <div className="flex rounded-xl bg-studio-100 dark:bg-studio-800 p-1">
                    <button
                      onClick={() =>
                        updateSettings({
                          textStamp: { ...settings.textStamp, position: 'top' },
                        })
                      }
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        settings.textStamp.position === 'top'
                          ? 'bg-white dark:bg-studio-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-studio-500 hover:text-studio-900 dark:hover:text-white'
                      }`}
                    >
                      Top
                    </button>
                    <button
                      onClick={() =>
                        updateSettings({
                          textStamp: { ...settings.textStamp, position: 'bottom' },
                        })
                      }
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        settings.textStamp.position === 'bottom'
                          ? 'bg-white dark:bg-studio-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-studio-500 hover:text-studio-900 dark:hover:text-white'
                      }`}
                    >
                      Bottom
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="p-4 border-t border-studio-200 dark:border-studio-800 bg-studio-50/60 dark:bg-studio-950/40 flex items-center gap-2">
        
        {/* Hidden file input for adding more photos */}
        <input
          ref={addFilesInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleAddMoreFiles}
          className="hidden"
        />

        <button
          onClick={() => addFilesInputRef.current?.click()}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-studio-300 dark:border-studio-700 hover:bg-studio-100 dark:hover:bg-studio-800 text-studio-700 dark:text-studio-300 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('editor.addMorePhotos')}</span>
        </button>

        <button
          onClick={shuffleLayout}
          title={t('editor.shuffleLayout')}
          className="flex items-center justify-center p-2.5 rounded-xl border border-studio-300 dark:border-studio-700 hover:bg-studio-100 dark:hover:bg-studio-800 text-studio-700 dark:text-studio-300 text-xs font-semibold transition-colors"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};
