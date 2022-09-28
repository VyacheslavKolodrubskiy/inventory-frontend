import { klonaLite } from '@qlt2020/frutils';
import { defineStore } from 'pinia';
import { i18n } from '@/i18n';
import { updateColorMode } from '@/shared/config/app-config';
import type { LayoutSettings } from '@/shared/config/layout-settings';
import { layoutSettings } from '@/shared/config/layout-settings';
import { getStorageShortName } from '@/shared/config/env';

export interface AppState {
  isSidebarCollapsed: boolean
  showMobileMenu: boolean
  settings: LayoutSettings
}

const STORE_ID = 'app';

export const useAppStore = defineStore(STORE_ID, {
  state: (): AppState => ({
    isSidebarCollapsed: false,
    showMobileMenu: false,
    settings: klonaLite(layoutSettings),
  }),
  getters: {
    isLightNavigation(): boolean {
      return [this.settings.sidebarTheme, this.settings.headerTheme].every(theme => theme === 'light');
    },
  },
  actions: {
    toggleSidebarCollapsed() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    resetLayoutSettings() {
      this.settings = klonaLite(layoutSettings);
      updateColorMode('none');
      message.success(i18n.t('message.defaultLayoutSettings'));
    },
  },
  persist: {
    key: getStorageShortName(STORE_ID),
  },
});
