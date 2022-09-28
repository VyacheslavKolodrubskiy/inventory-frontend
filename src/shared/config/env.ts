import type { GlobEnvConfig } from '@/env';
import { APP_VERSION } from '@/shared/config/constants';

export const envMode = import.meta.env.MODE;
export const isDevEnv = import.meta.env.DEV;
export const isProdEnv = import.meta.env.PROD;

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnv();
  return `${VITE_GLOB_APP_SHORT_NAME}__${envMode}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName(moduleName = '') {
  let name = `${getCommonStoragePrefix()}__v${APP_VERSION}`;

  if (moduleName)
    name += `__${moduleName}`;

  return name.toUpperCase();
}

export function getAppEnv(): GlobEnvConfig {
  const ENV = import.meta.env as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    console.warn(
      'VITE_GLOB_APP_SHORT_NAME variable can only be characters/underscores, please modify in the environment variable and re-run.',
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
  };
}

