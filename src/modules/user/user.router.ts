import type { RouteRecordRaw, Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

const moduleRoute: RouteRecordRaw = {
  path: 'users',
  name: 'User',
  redirect: { name: 'UserManager.Main' },
  component: () => import('@/shared/components/TheEmptyRouterView.vue'),
  meta: {
    breadcrumbName: 'common.users',
    permissions: ['Admin'],
  },
  children: [],
};

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
