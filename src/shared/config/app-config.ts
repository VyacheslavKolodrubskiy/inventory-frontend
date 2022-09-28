import { objectKeys } from '@qlt2020/frutils';
import { useAppStore } from '@/shared/store/app.store';
import { getCommonStoragePrefix, getStorageShortName } from '@/shared/config/env';
import type { ColorMode } from '@/shared/config/layout-settings';

export function updateColorMode(mode: ColorMode) {
  const docElement = document.documentElement.classList;
  switch (mode) {
    case 'weak':
      docElement.add('color-weak');
      docElement.remove('gray-mode');
      break;
    case 'gray':
      docElement.remove('color-weak');
      docElement.add('gray-mode');
      break;
    default:
      docElement.remove('color-weak');
      docElement.remove('gray-mode');
  }
}

export function initAppConfig() {
  const appStore = useAppStore();

  updateColorMode(appStore.settings.colorMode);

  // todo init dark theme

  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */

export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  objectKeys(localStorage).forEach((key) => {
    key = key.toString();

    // If MAJOR app version differs with key major version, then remove LS key
    if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix))
      localStorage.removeItem(key);
  });
}

