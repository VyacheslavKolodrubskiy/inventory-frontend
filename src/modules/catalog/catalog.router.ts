import type { RouteRecordRaw, Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

const moduleRoute: RouteRecordRaw = {
  path: 'catalog',
  name: 'Catalog',
  redirect: { name: 'CatalogCity.Main' },
  component: () => import('@/shared/components/TheEmptyRouterView.vue'),
  meta: {
    breadcrumbName: 'common.catalog',
  },
  children: [],
};

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
