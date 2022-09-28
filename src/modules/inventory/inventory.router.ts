import type { RouteRecordRaw, Router } from 'vue-router';
import { createRegistryProductView } from '../registry-product/registry-product.router';
import { createWarehouseEdit, createWarehouseView } from '../counterparty/warehouse/warehouses-and-places.router';
import { createManagerView } from '../user/manager/manager.router';
import { PageName } from '@/shared/enums/common.enum';
import { getModalPath } from '@/shared/utils/router-utils';

const InventoryMain = () => import('@/modules/inventory/pages/InventoryMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'inventory',
  name: 'Inventory',
  redirect: { name: 'Inventory.Main' },
  meta: {
    permissions: ['Admin'],
    breadcrumbName: 'common.inventory',
  },
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Inventory.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        title: 'common.inventory',
      },
      component: InventoryMain,
    },
    {
      path: 'add',
      name: 'Inventory.Add',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'common.inventory',
        title: 'common.inventory',
      },
      component: () => import('@/modules/inventory/pages/InventoryAdd.vue'),
    },
    {
      path: ':inventoryId/edit',
      name: 'Inventory.Edit',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'inventory.edit',
        title: 'inventory.edit',
      },
      component: () => import('@/modules/inventory/pages/InventoryEdit.vue'),
    },
    createInventoryView(),

    createWarehouseView({
      name: 'Inventory.Warehouse.View',
      defaultComponent: InventoryMain,
    }),

    createManagerView({
      name: 'Inventory.Manager.View',
      defaultComponent: InventoryMain,
    }),

    createWarehouseEdit({
      name: 'Inventory.Warehouse.Edit',
      defaultComponent: InventoryMain,
    }),

    createRegistryProductView({
      name: 'Inventory.RegistryProduct.View',
      defaultComponent: InventoryMain,
    }),
  ],

};

export function createInventoryView(
  { name = 'Inventory.View', defaultComponent = InventoryMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('inventory'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'inventory.view',
      title: 'inventory.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/inventory/pages/InventoryView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};

