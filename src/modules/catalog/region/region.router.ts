import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const RegionMain = () => import('@/modules/catalog/region/pages/RegionMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'regions',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'CatalogRegion.Main',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'region.title',
        title: 'region.title',
      },
      component: RegionMain,
    },
    {
      path: getModalPath('region', 'add'),
      name: 'CatalogRegion.Add',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'region.add',
        title: 'region.add',
      },
      components: {
        default: RegionMain,
        modal: () => import('@/modules/catalog/region/pages/RegionAdd.vue'),
      },
    },

    createRegionEdit(),
  ],
};

export function createRegionEdit(
  { name = 'CatalogRegion.Edit', defaultComponent = RegionMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('region', 'edit'),
    name,
    meta: {
      permissions: ['Admin'],
      breadcrumbName: 'region.edit',
      title: 'region.edit',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/region/pages/RegionEdit.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
