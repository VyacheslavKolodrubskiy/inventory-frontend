import type { RouteRecordRaw, Router } from 'vue-router';
import { createWarehouseEdit, createWarehouseView } from '../counterparty/warehouse/warehouses-and-places.router';
import { createManagerView } from '../user/manager/manager.router';
import { createRegistryProductView } from '@/modules/registry-product/registry-product.router';
import { PageName } from '@/shared/enums/common.enum';
import { getModalPath } from '@/shared/utils/router-utils';

const MarkingMain = () => import('@/modules/marking/pages/MarkingMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'marking',
  name: 'Marking',
  redirect: { name: 'Marking.Main' },
  meta: {
    permissions: ['Admin'],
    breadcrumbName: 'common.marking',
  },
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Marking.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        title: 'common.marking',
      },
      component: MarkingMain,
    },
    {
      path: 'add',
      name: 'Marking.Add',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'common.marking',
        title: 'common.marking',
      },
      component: () => import('@/modules/marking/pages/MarkingAdd.vue'),
    },
    {
      path: ':markingId/edit',
      name: 'Marking.Edit',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'marking.edit',
        title: 'marking.edit',
      },
      component: () => import('@/modules/marking/pages/MarkingEdit.vue'),
    },

    createMarkingView(),

    createWarehouseView({
      name: 'Marking.Warehouse.View',
      defaultComponent: MarkingMain,
    }),

    createManagerView({
      name: 'Marking.Manager.View',
      defaultComponent: MarkingMain,
    }),

    createWarehouseEdit({
      name: 'Marking.Warehouse.Edit',
      defaultComponent: MarkingMain,
    }),

    createRegistryProductView({
      name: 'Marking.RegistryProduct.View',
      defaultComponent: MarkingMain,
    }),
  ],
};

export function createMarkingView(
  { name = 'Marking.View', defaultComponent = MarkingMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('marking'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'marking.view',
      title: 'marking.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/marking/pages/MarkingView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};

