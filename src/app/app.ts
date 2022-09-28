import { createApp } from 'vue';
import 'dayjs/locale/ru';
import 'dayjs/locale/kk';

import './styles/app.less';
import 'uno.css';

import App from './App.vue';
import { router, setupRouter } from './router';
import { setupI18n } from '@/i18n';

import {
  registerErrorHandlers,
  registerGlobalComponents,
  registerGlobalProperties, registerModules,
  setupPlugins,
} from '@/app/providers';
import { setupStore } from '@/shared/store';
import { initAppConfig } from '@/shared/config/app-config';
import { setupRouterGuards } from '@/app/router/guards';

export async function init() {
  const app = createApp(App);

  setupStore(app);

  initAppConfig();

  registerModules(router);

  setupRouter(app);

  setupRouterGuards(router);

  await setupI18n(app);

  setupPlugins(app);

  registerGlobalComponents(app);

  registerGlobalProperties(app);

  registerErrorHandlers(app);

  app.mount('#app');
}

