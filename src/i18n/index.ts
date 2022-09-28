import { createI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import type { App } from 'vue';
import type { DefaultModule } from '@/types';
import { localeConfig } from '@/shared/config/locale-config';
import type { Locale } from '@/shared/config/locale-config';
import { useLocaleStoreOutside } from '@/shared/store/locale.store';
import { cyrillicRule } from '@/i18n/pluralization';

const loadedLanguages: Locale[] = [];

const { locale: defaultLocale, fallbackLocale, availableLocales } = localeConfig;

export const i18nApp = createI18n({
  // you must set `false`, to use Composition API
  legacy: false,
  locale: defaultLocale,
  fallbackLocale,
  availableLocales,
  pluralizationRules: { ru: cyrillicRule, kk: cyrillicRule },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
});

const { global: i18n } = i18nApp;
export { i18n };

export async function setupI18n(app: App) {
  const localeStore = useLocaleStoreOutside();

  app.use(i18nApp);

  await localeStore.initLocale();
}

export function setLanguage(lang: Locale) {
  i18n.locale.value = availableLocales.includes(lang) ? lang : defaultLocale;

  dayjs.locale(i18n.locale.value);
  document.querySelector('html')!.setAttribute('lang', i18n.locale.value);

  return i18n.locale.value as Locale;
}

export async function loadLanguageAsync(lang: Locale) {
  if (
    // If the same language and not first load
    (i18n.locale.value === lang && loadedLanguages.length)
    // If the language was already loaded
    || loadedLanguages.includes(lang)
  )
    return Promise.resolve(setLanguage(lang));

  // If the language hasn't been loaded yet
  const messages: DefaultModule = await import(`./${lang}/index.ts`);

  i18n.setLocaleMessage(lang, messages.default);
  loadedLanguages.push(lang);

  return setLanguage(lang);
}
