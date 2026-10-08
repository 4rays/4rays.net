import {defaultLocale, locales, translations, type Locale} from "./constants";

export function getLocaleFromParams(
  params: Record<string, string | undefined>
): Locale {
  const lang = params.lang;
  return lang && locales.includes(lang as Locale)
    ? (lang as Locale)
    : defaultLocale;
}

export function useTranslations(locale?: Locale) {
  return translations[locale || defaultLocale];
}

export function localizeUrl(path: string, locale?: Locale): string {
  const safeLocale =
    locale && locales.includes(locale as Locale)
      ? (locale as Locale)
      : defaultLocale;

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  if (!cleanPath) {
    // If it's just the root path
    return safeLocale === defaultLocale ? "/" : `/${safeLocale}/`;
  }

  // Check if path already has a locale prefix
  const segments = cleanPath.split("/");
  if (locales.includes(segments[0] as Locale)) {
    // Replace existing locale with new one
    segments[0] = safeLocale;
    return `/${segments.join("/")}`;
  }

  // The default locale lives at the root, other locales under a prefix
  return safeLocale === defaultLocale
    ? `/${cleanPath}`
    : `/${safeLocale}/${cleanPath}`;
}

// getStaticPaths helper for [...lang] routes: the default locale renders at
// the unprefixed path, every other locale under its prefix.
export function getLocaleStaticPaths() {
  return [
    {params: {lang: undefined}},
    ...locales
      .filter((locale) => locale !== defaultLocale)
      .map((locale) => ({params: {lang: locale}}))
  ];
}
