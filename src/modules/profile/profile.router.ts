import type { RouteRecordRaw, Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

const moduleRoute: RouteRecordRaw = {
  path: 'profile',
  name: 'Profile',
  component: () => import('@/modules/profile/pages/ProfileView.vue'),
  meta: {
    breadcrumbName: 'common.profile',
    title: 'common.profile',
  },
};

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
