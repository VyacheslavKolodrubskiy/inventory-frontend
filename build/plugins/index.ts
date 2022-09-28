import vue from '@vitejs/plugin-vue';
import type { Plugin, PluginOption } from 'vite';
import type { ViteEnv } from '../types';
import { configAutoImportPlugin } from './auto-import';
import { configComponentsPlugin } from './components';
import { configHtmlPlugin } from './html';
import { configUnocssPlugin } from './unocss';
import { configVisualizerPlugin } from './visualizer';
import { configImageminPlugin } from './imagemin';
import { configCompressPlugin } from './compress';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins: PluginOption[] = [
    vue({
      reactivityTransform: true,
    }),
  ];

  // unocss
  vitePlugins.push(configUnocssPlugin());

  // unplugin-auto-import
  vitePlugins.push(configAutoImportPlugin());

  // unplugin-vue-components
  vitePlugins.push(configComponentsPlugin());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // rollup-plugin-visualizer
  // TODO Change type assetion when vite will be updated
  vitePlugins.push(configVisualizerPlugin() as Plugin);

  if (isBuild) {
    // vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // vite-plugin-compression
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );
  }

  return vitePlugins;
}
