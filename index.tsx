"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
// Initial base translations for critical path
import zh_Hans from "./zh_Hans.json";
import en from "./en.json";
import { supportedLocales, defaultLocale as baseDefaultLocale } from "./locales";

type TranslationDict = Record<string, string>;

function getLocalStorageSafe(): Storage | null {
  const maybeStorage = globalThis?.localStorage;
  if (!maybeStorage) {
    return null;
  }

  try {
    const probeKey = "__whusb_storage_probe__";
    maybeStorage.getItem(probeKey);
    return maybeStorage;
  } catch {
    return null;
  }
}

// Static map for Metro to resolve bundles at build time
const localeBundles: Record<string, any> = {
  zh_Hans,
  en,
  ja: require("./ja.json"),
  ko: require("./ko.json"),
  fr: require("./fr.json"),
  es: require("./es.json"),
  pt: require("./pt.json"),
  ru: require("./ru.json"),
  vi: require("./vi.json"),
  yue_Hans: require("./yue_Hans.json"),
  yue_Hant: require("./yue_Hant.json"),
  zh_Hant: require("./zh_Hant.json"),
};

export { supportedLocales, baseDefaultLocale as defaultLocale };

type I18nContextType = {
  t: (key: string, variables?: Record<string, string | number>) => string;
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
};

const I18nContext = createContext<I18nContextType>({
  t: (key: string) => key,
  locale: baseDefaultLocale,
  setLocale: () => {},
  isLoading: false,
});

export const I18nProvider = ({ children, initialLocale = baseDefaultLocale }: { children: ReactNode, initialLocale?: string }) => {
  const [locale, setLocaleState] = useState(initialLocale);
  const [translations, setTranslations] = useState<TranslationDict>(localeBundles[initialLocale] || zh_Hans);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const storage = getLocalStorageSafe();
    const savedLocale = storage?.getItem('whusb_locale') ?? null;
    if (savedLocale && savedLocale !== locale && supportedLocales.some(l => l.code === savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    const storage = getLocalStorageSafe();
    storage?.setItem('whusb_locale', newLocale);
  };

  useEffect(() => {
    // Metro-friendly static loading
    const data = localeBundles[locale] || zh_Hans;
    setTranslations(data as TranslationDict);
  }, [locale]);

  const t = useMemo(() => {
    return (key: string, variables?: Record<string, string | number>): string => {
      let text = translations[key] || (zh_Hans as TranslationDict)[key] || key;
      if (variables) {
        Object.keys(variables).forEach((varKey) => {
          text = text.replace(new RegExp(`{${varKey}}`, 'g'), String(variables[varKey]));
        });
      }
      return text;
    };
  }, [translations]);

  return (
    <I18nContext.Provider value={{ t, locale, setLocale, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(I18nContext);
};

/**
 * Helper for i18next integration in mixed environments (Next.js/React Native)
 * Returns all static bundles identified in the manifest.
 */
export function toI18nextResources() {
  return {
    zh_Hans: { translation: zh_Hans },
    en: { translation: en },
    // Other languages can be added here as they are prioritized
  };
}

// end of file exports
export { baseDefaultLocale as fallbackLocale };

// Legacy support for non-react environments
export function getStaticTranslation(locale: string, key: string): string {
  const dict = localeBundles[locale] || (zh_Hans as TranslationDict);
  return dict[key] || (zh_Hans as TranslationDict)[key] || key;
}
