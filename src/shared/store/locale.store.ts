import { defineStore } from 'pinia';
import type { Locale } from '@/shared/config/locale-config';
import { getPreferredLanguage } from '@/shared/config/locale-config';
import { loadLanguageAsync } from '@/i18n';
import { useAntdLocales } from '@/shared/composables/useAntdLocales';
import { useSecondaryLoading } from '@/shared/composables/useLoading';
import { store } from '@/shared/store';
import { getStorageShortName } from '@/shared/config/env';

export interface LocaleState {
  locale: Locale
}

const { loadAntdLocale } = useAntdLocales();
const { startLoading, stopLoading } = useSecondaryLoading();

const STORE_ID = 'locale';

export const useLocaleStore = defineStore(STORE_ID, {
  state: (): LocaleState => ({
    locale: getPreferredLanguage(),
  }),
  getters: {
  },
  actions: {
    async setLocale(value: Locale) {
      startLoading();
      const [newLocale] = await Promise.all([loadLanguageAsync(value), loadAntdLocale(value)]);
      stopLoading();

      this.locale = newLocale;

      return newLocale;
    },
    async initLocale() {
      await this.setLocale(this.locale);
    },
  },
  persist: {
    key: getStorageShortName(STORE_ID),
  },
});

// Need to be used outside the setup
export function useLocaleStoreOutside() {
  return useLocaleStore(store);
}
