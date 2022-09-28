/**
 * Plugin to minimize and use ejs template syntax in index.html
 * https://github.com/anncwb/vite-plugin-html
 */
import { createHtmlPlugin } from 'vite-plugin-html';
import type { ViteEnv } from '../types';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE } = env;

  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
    },
  });
}
