/**
 * Locale Manifest for WHU.sb
 * This file lists all available translations and their metadata.
 */

export interface LocaleMetadata {
  code: string;
  name: string;
  flag?: string;
  isRTL?: boolean;
}

export const supportedLocales: LocaleMetadata[] = [
  { code: "zh_Hans", name: "简体中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "yue_Hans", name: "粤语 (简体)" },
  { code: "yue_Hant", name: "粵語 (繁體)" },
  { code: "zh_Hant", name: "繁體中文" },
];

export const defaultLocale = "zh_Hans";

/**
 * Helper to get metadata for a locale code
 */
export function getLocaleMetadata(code: string): LocaleMetadata | undefined {
  return supportedLocales.find(l => l.code === code) || supportedLocales.find(l => l.code.startsWith(code.split('-')[0]));
}
