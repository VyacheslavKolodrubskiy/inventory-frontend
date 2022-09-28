import { createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from '@/app/router/routes';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export function setupRouter(app: App) {
  app.use(router);
}
