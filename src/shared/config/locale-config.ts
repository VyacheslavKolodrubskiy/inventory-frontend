export const enum Locale {
  KK = 'kk',
  RU = 'ru',
}

export const localeConfig = Object.freeze({
  availableLocales: [Locale.RU, Locale.KK],
  locale: Locale.RU,
  fallbackLocale: Locale.RU,
});

export function getPreferredLanguage() {
  const preferredLocale = window.navigator.languages
    .find(lang => localeConfig.availableLocales.includes(lang as Locale));
  return preferredLocale as Locale || Locale.RU;
}

export const localeList = [
  { key: Locale.KK, title: 'Қазақша' },
  { key: Locale.RU, title: 'Русский' },
];
