import type { RouteRecordRaw, Router } from 'vue-router';
import { createCounterpartyEdit, createCounterpartyView } from '../counterparty-info/counterparty-info.router';
import { getModalPath } from '@/shared/utils/router-utils';

const WarehouseMain = () => import('@/modules/counterparty/warehouse/pages/WarehouseMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'warehouses',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Warehouse.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'warehouse.title',
        title: 'warehouse.title',
      },
      component: WarehouseMain,
    },
    {
      path: getModalPath('warehouse', 'add'),
      name: 'Warehouse.Add',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'warehouse.addWarehouse',
        title: 'warehouse.addWarehouse',
      },
      components: {
        default: WarehouseMain,
        modal: () => import('@/modules/counterparty/warehouse/pages/WarehouseAdd.vue'),
      },
    },

    {
      path: getModalPath('warehouse-place', 'add'),
      name: 'WarehousePlace.Add',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'warehouse.addPlace',
        title: 'warehouse.addPlace',
      },
      components: {
        default: WarehouseMain,
        modal: () => import('@/modules/counterparty/warehouse/pages/WarehousePlaceAdd.vue'),
      },
    },
    {
      path: getModalPath('warehouse-place'),
      name: 'WarehousePlace.View',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'warehouse.viewPlace',
        title: 'warehouse.viewPlace',
      },
      components: {
        default: WarehouseMain,
        modal: () => import('@/modules/counterparty/warehouse/pages/WarehousePlaceView.vue'),
      },
    },
    {
      path: getModalPath('warehouse-place', 'edit'),
      name: 'WarehousePlace.Edit',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'warehouse.editPlace',
        title: 'warehouse.editPlace',
      },
      components: {
        default: WarehouseMain,
        modal: () => import('@/modules/counterparty/warehouse/pages/WarehousePlaceEdit.vue'),
      },
    },
    createWarehouseView(),

    createWarehouseEdit(),

    createCounterpartyView({
      name: 'Warehouse.Counterparty.View',
      defaultComponent: WarehouseMain,
    }),

    createCounterpartyEdit({
      name: 'Warehouse.Counterparty.Edit',
      defaultComponent: WarehouseMain,
    }),
  ],
};

export function createWarehouseEdit(
  { name = 'Warehouse.Edit', defaultComponent = WarehouseMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('warehouse'),
    name,
    meta: {
      permissions: ['Admin'],
      breadcrumbName: 'warehouse.editWarehouse',
      title: 'warehouse.editWarehouse',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/counterparty/warehouse/pages/WarehouseEdit.vue'),
    },
  };
}

export function createWarehouseView(
  { name = 'Warehouse.View', defaultComponent = WarehouseMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('warehouse'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'warehouse.viewWarehouse',
      title: 'warehouse.viewWarehouse',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/counterparty/warehouse/pages/WarehouseView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute('Counterparty', moduleRoute);
};
