import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const UnitMain = () => import('@/modules/catalog/unit/pages/UnitMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'units',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'CatalogUnit.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'common.units',
        title: 'common.units',
      },
      component: UnitMain,
    },

    {
      path: getModalPath('unit', 'add'),
      name: 'CatalogUnit.Add',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'unit.add',
        title: 'unit.add',
      },
      components: {
        default: UnitMain,
        modal: () => import('@/modules/catalog/unit/pages/UnitAdd.vue'),
      },
    },

    {
      path: getModalPath('unit', 'edit'),
      name: 'CatalogUnit.Edit',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'unit.edit',
        title: 'unit.edit',
      },
      components: {
        default: UnitMain,
        modal: () => import('@/modules/catalog/unit/pages/UnitEdit.vue'),
      },
    },

  ],
};

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
