import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'EN' | 'KO';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Automatically load all JSON files from /languages/**
const rawLangModules = import.meta.glob('../../languages/**/*.json', { eager: true }) as Record<string, { default: any } | any>;

function buildTranslationDictionary(): Record<SupportedLanguage, Record<string, any>> {
  const dict: Record<SupportedLanguage, Record<string, any>> = {
    EN: {},
    KO: {},
  };

  for (const path in rawLangModules) {
    // Expected path format: ../../languages/(EN|KO)/(filename).json
    const match = path.match(/\/languages\/(EN|KO)\/(.+)\.json$/i);
    if (!match) continue;
    const [, localeRaw, fileName] = match;
    const locale = localeRaw.toUpperCase() as SupportedLanguage;
    const content = rawLangModules[path].default || rawLangModules[path];

    // Determine namespace from filename, e.g. "src-components-header-navigation" -> "header"
    let namespace = fileName;
    if (fileName.includes('header')) namespace = 'header';
    else if (fileName.includes('editor')) namespace = 'editor';
    else if (fileName.includes('presets') || fileName.includes('templates')) namespace = 'presets';
    else if (fileName.includes('export')) namespace = 'export';
    else if (fileName.includes('common')) namespace = 'common';
    else if (fileName.includes('crop')) namespace = 'crop';

    // Store under namespace
    dict[locale][namespace] = {
      ...(dict[locale][namespace] || {}),
      ...content,
    };

    // Also store by exact filename without .json for full specificity
    dict[locale][fileName] = content;

    // Merge root level keys for easy lookup if no namespace collision
    Object.assign(dict[locale], content);
  }

  return dict;
}

const translations = buildTranslationDictionary();

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Rule: EN is default
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('collagecraft_lang');
      if (saved === 'KO' || saved === 'EN') return saved;
    } catch {
      // ignore
    }
    return 'EN';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('collagecraft_lang', lang);
      document.documentElement.lang = lang.toLowerCase();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  /**
   * Translate key with optional parameter substitution {param}
   * Supports: 'header.brandName', 'editor.photoCount', 'common.filters.warm', or flat 'brandName'
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const localeDict = translations[language] || translations.EN;
    const fallbackDict = translations.EN;

    // Helper to resolve nested dots: "a.b.c"
    const resolve = (obj: any, path: string): any => {
      if (!obj) return undefined;
      const parts = path.split('.');
      let cur = obj;
      for (const p of parts) {
        if (cur === undefined || cur === null) return undefined;
        cur = cur[p];
      }
      return cur;
    };

    let result = resolve(localeDict, key);
    if (result === undefined) {
      // try flat fallback
      result = localeDict[key];
    }
    if (result === undefined) {
      // try fallback language (EN)
      result = resolve(fallbackDict, key) ?? fallbackDict[key];
    }
    if (result === undefined) {
      return key; // return key if not found
    }

    if (typeof result !== 'string') {
      return String(result);
    }

    // Replace {params}
    if (params) {
      return result.replace(/\{(\w+)\}/g, (_, varName) => {
        return params[varName] !== undefined ? String(params[varName]) : `{${varName}}`;
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
