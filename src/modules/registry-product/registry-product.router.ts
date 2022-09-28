import type { RouteRecordRaw, Router } from 'vue-router';
import { createWarehouseEdit, createWarehouseView } from '../counterparty/warehouse/warehouses-and-places.router';
import { createManagerView } from '../user/manager/manager.router';
import { PageName } from '@/shared/enums/common.enum';
import { getModalPath } from '@/shared/utils/router-utils';

const RegistryProductMain = () => import('@/modules/registry-product/pages/RegistryProductMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'warehouse-products',
  name: 'RegistryProduct',
  redirect: { name: 'RegistryProduct.Main' },
  meta: {
    breadcrumbName: 'common.productRegistry',
  },
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'RegistryProduct.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        title: 'common.productRegistry',
      },
      component: RegistryProductMain,
    },
    createRegistryProductView(),

    createWarehouseView({
      name: 'RegistryProduct.Warehouse.View',
      defaultComponent: RegistryProductMain,
    }),

    createWarehouseEdit({
      name: 'RegistryProduct.Warehouse.Edit',
      defaultComponent: RegistryProductMain,
    }),

    createManagerView({
      name: 'RegistryProduct.Manager.View',
      defaultComponent: RegistryProductMain,
    }),
  ],
};

export function createRegistryProductView(
  { name = 'RegistryProduct.View', defaultComponent = RegistryProductMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('product'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'product.viewWarehouse',
      title: 'product.viewWarehouse',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/registry-product/pages/RegistryProductView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
