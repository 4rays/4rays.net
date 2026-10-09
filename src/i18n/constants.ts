import enTranslations from "@/translations/en.json";

export type Translations = typeof enTranslations;

export const locales = ["en"] as const;
export type Locale = (typeof locales)[number]; // "en"

export const defaultLocale: Locale = "en";

export const translations: Record<Locale, Translations> = {
  en: enTranslations
};

export const localeNames: Record<Locale, string> = {
  en: "English"
};
