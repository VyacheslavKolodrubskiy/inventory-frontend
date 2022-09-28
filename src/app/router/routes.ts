import type { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

export const routes: RouteRecordRaw[] = [
  {
    path: '/logout',
    name: PageName.LOGOUT,
    component: () => import('@/modules/auth/pages/Logout.vue'),
  },

  {
    path: '/',
    name: PageName.BASE_LAYOUT,
    redirect: { name: PageName.BASE_HOME },
    component: () => import('@/shared/layouts/TheLayoutDefault.vue'),
    children: [],
  },
];
