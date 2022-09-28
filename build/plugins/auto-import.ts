/**
 * Auto import APIs on-demand for Vite, Webpack, Rollup and esbuild
 * https://github.com/antfu/unplugin-auto-import
 */

import AutoImport from 'unplugin-auto-import/vite';

export function configAutoImportPlugin() {
  return AutoImport({
    imports: [
      'vue',
      'vue-router',
      {
        '@vueuse/core': [
          'useCounter',
          'useEventListener',
          'useDebounceFn',
          'useThrottleFn',
        ],
        'ant-design-vue': ['notification', 'message', 'Modal'],
        'vue-i18n': ['useI18n'],
      },
    ],
    dts: true,
  });
}

