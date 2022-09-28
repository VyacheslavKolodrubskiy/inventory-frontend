import type { RouteRecordRaw, Router } from 'vue-router';
import Error500 from '@/modules/basic/pages/Error500.vue';
import { setFromRedirect } from '@/app/router/per-page-guards';
import { PageName } from '@/shared/enums/common.enum';

const moduleRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect/:path(.*)',
    name: PageName.REDIRECT,
    component: () => import('@/modules/basic/pages/Redirect.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: () => import('@/shared/components/TheEmptyRouterView.vue'),
    children: [
      {
        path: 'malformed-link',
        name: 'ErrorMalformedLink',
        meta: {
          title: 'common.errorMalformedLink',
          public: true,
        },
        component: () => import('@/modules/basic/pages/ErrorMalformedLink.vue'),
      },

      {
        path: 'forbidden',
        name: 'Error403',
        meta: {
          title: 'common.error403',
        },
        component: () => import('@/modules/basic/pages/Error403.vue'),
      },

      {
        path: 'internal-server-error',
        name: PageName.ERROR_500,
        meta: {
          title: 'common.error500',
          public: true,
        },
        /*
         * Эта страница должна быть загружена заранее,
         * т.к. если будет проблема с интернетом, мы легко сможем на неё редиректнуть
         */
        component: Error500,
        beforeEnter: [setFromRedirect],
      },

      {
        // Important! Slash prefix ensures that route will be root and child of ErrorPage in same time
        path: '/:pathMatch(.*)*',
        name: 'Error404',
        meta: {
          title: 'common.error404',
          public: true,
        },
        component: () => import('@/modules/basic/pages/Error404.vue'),
      },
    ],
  },
];

export default (router: Router) => {
  moduleRoutes.forEach(route => router.addRoute(route));
};
