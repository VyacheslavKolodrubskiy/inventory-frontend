import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { parseEnv } from './build/utils';
import { createVitePlugins } from './build/plugins';

// https://vitejs.dev/config
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = parseEnv(env);

  const isBuild = command === 'build';

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    plugins: createVitePlugins(viteEnv, isBuild),

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
