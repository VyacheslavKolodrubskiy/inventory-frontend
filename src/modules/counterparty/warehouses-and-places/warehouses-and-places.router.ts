import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const WarehousesAndPlacesMain = () => import('@/modules/counterparty/warehouses-and-places/pages/WarehousesAndPlacesMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'warehouses-and-places',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'WarehousesAndPlaces.Main',
      meta: {
        breadcrumbName: 'warehouses-and-places.title',
        title: 'warehouses-and-places.title',
        permissions: ['Manager'],
      },
      component: WarehousesAndPlacesMain,
    },
    {
      path: getModalPath('warehouse', 'add'),
      name: 'Warehouse.Add',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.addWarehouse',
        title: 'warehouses-and-places.addWarehouse',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehouseAdd.vue'),
      },
    },
    {
      path: getModalPath('warehouse'),
      name: 'Warehouse.View',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.viewWarehouse',
        title: 'warehouses-and-places.viewWarehouse',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehouseView.vue'),
      },
    },
    {
      path: getModalPath('warehouse', 'edit'),
      name: 'Warehouse.Edit',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.editWarehouse',
        title: 'warehouses-and-places.editWarehouse',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehouseEdit.vue'),
      },
    },

    {
      path: getModalPath('warehouse-place', 'add'),
      name: 'WarehousePlace.Add',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.addPlace',
        title: 'warehouses-and-places.addPlace',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehousePlaceAdd.vue'),
      },
    },
    {
      path: getModalPath('warehouse-place'),
      name: 'WarehousePlace.View',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.viewPlace',
        title: 'warehouses-and-places.viewPlace',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehousePlaceView.vue'),
      },
    },
    {
      path: getModalPath('warehouse-place', 'edit'),
      name: 'WarehousePlace.Edit',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'warehouses-and-places.editPlace',
        title: 'warehouses-and-places.editPlace',
      },
      components: {
        default: WarehousesAndPlacesMain,
        modal: () => import('@/modules/counterparty/warehouses-and-places/pages/WarehousePlaceEdit.vue'),
      },
    },
  ],
};

export default (router: Router) => {
  router.addRoute('Counterparty', moduleRoute);
};
