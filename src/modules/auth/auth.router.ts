import type { RouteRecordRaw, Router } from 'vue-router';

const moduleRoute: RouteRecordRaw = {
  path: '/auth',
  meta: {
    onlyLoggedOut: true,
  },
  component: () => import('@/shared/layouts/TheLayoutAuth.vue'),
  children: [
    {
      path: 'login',
      name: 'Login',
      meta: {
        title: 'common.authorize',
      },
      component: () => import('@/modules/auth/pages/Login.vue'),
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
