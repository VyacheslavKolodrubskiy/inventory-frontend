import type { RouteRecordRaw, Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

const moduleRoute: RouteRecordRaw = {
  path: 'counterparty',
  name: 'Counterparty',
  redirect: { name: 'Counterparty.Main' },
  component: () => import('@/shared/components/TheEmptyRouterView.vue'),
  meta: {
    breadcrumbName: 'common.counterparty',
  },
  children: [],
};

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
