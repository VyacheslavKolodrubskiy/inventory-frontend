import { forOwn, isString } from '@qlt2020/frutils';
import type { ViteEnv } from './types';

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

export function parseEnv(envConf: Record<string, unknown>): ViteEnv {
  const ret: any = {};

  forOwn(envConf, (value, envName) => {
    if (!isString(value))
      return;

    ret[envName] = value === 'true' ? true : value === 'false' ? false : value;
  });
  return ret;
}
