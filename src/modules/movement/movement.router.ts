import type { RouteRecordRaw, Router } from 'vue-router';
import { createManagerView } from '../user/manager/manager.router';
import { createWarehouseEdit, createWarehouseView } from '../counterparty/warehouse/warehouses-and-places.router';
import { createInventoryView } from '../inventory/inventory.router';
import { createRegistryProductView } from '@/modules/registry-product/registry-product.router';
import { createProductAdd } from '@/modules/catalog/product/product.router';
import { PageName } from '@/shared/enums/common.enum';
import { getModalPath } from '@/shared/utils/router-utils';

const MovementMain = () => import('@/modules/movement/pages/MovementMain.vue');
const ReceiveAdd = () => import('@/modules/movement/pages/ReceiveAdd.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'movements',
  name: 'Movements',
  redirect: { name: 'Movements.Main' },
  meta: {
    breadcrumbName: 'common.productMovement',
  },
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Movement.Main',
      meta: {
        title: 'common.productMovement',
      },
      component: MovementMain,
    },

    {
      path: 'receive',
      component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
      children: [
        {
          path: 'add',
          name: 'Movement.Receive.Add',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'common.receive',
            title: 'common.receive',
          },
          component: ReceiveAdd,
        },
        {
          path: ':receiveId/edit',
          name: 'Movement.Receive.Edit',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'movement.edit',
            title: 'movement.edit',
          },
          component: () => import('@/modules/movement/pages/ReceiveEdit.vue'),
        },
        createProductAdd({
          name: 'Movement.Product.Add',
          defaultComponent: ReceiveAdd,
        }),
      ],
    },

    {
      path: 'relocation',
      component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
      children: [
        {
          path: 'add',
          name: 'Movement.Relocation.Add',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'common.movement',
            title: 'common.movement',
          },
          component: () => import('@/modules/movement/pages/RelocationAdd.vue'),
        },

        {
          path: ':relocationId/edit',
          name: 'Movement.Relocation.Edit',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'relocation.edit',
            title: 'relocation.edit',
          },
          component: () => import('@/modules/movement/pages/RelocationEdit.vue'),
        },
      ],
    },

    {
      path: 'write-off',
      component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
      children: [
        {
          path: 'add',
          name: 'Movement.WriteOff.Add',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'common.writeOff',
            title: 'common.writeOff',
          },
          component: () => import('@/modules/movement/pages/WriteOffAdd.vue'),
        },

        {
          path: ':writeOffId/edit',
          name: 'Movement.WriteOff.Edit',
          meta: {
            permissions: ['Manager'],
            breadcrumbName: 'write-off.edit',
            title: 'write-off.edit',
          },
          component: () => import('@/modules/movement/pages/WriteOffEdit.vue'),
        },
      ],
    },

    createReceiveView(),

    createRelocationView(),

    createWriteOffView(),

    createWarehouseView({
      name: 'Movement.Warehouse.View',
      defaultComponent: MovementMain,
    }),

    createManagerView({
      name: 'Movement.Manager.View',
      defaultComponent: MovementMain,
    }),

    createRegistryProductView({
      name: 'Movement.RegistryProduct.View',
      defaultComponent: MovementMain,
    }),

    createWarehouseEdit({
      name: 'Movement.Warehouse.Edit',
      defaultComponent: MovementMain,
    }),

    createInventoryView({
      name: 'Movement.Inventory.View',
      defaultComponent: MovementMain,
    }),

  ],
};

export function createReceiveView(
  { name = 'Movement.Receive.View', defaultComponent = MovementMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('receive'),
    name,
    meta: {
      breadcrumbName: 'movement.view',
      title: 'movement.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/movement/pages/ReceiveView.vue'),
    },
  };
}

export function createRelocationView(
  { name = 'Movement.Relocation.View', defaultComponent = MovementMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('relocation'),
    name,
    meta: {
      breadcrumbName: 'relocation.view',
      title: 'relocation.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/movement/pages/RelocationView.vue'),
    },
  };
}

export function createWriteOffView(
  { name = 'Movement.WriteOff.View', defaultComponent = MovementMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('write-off'),
    name,
    meta: {
      breadcrumbName: 'write-off.view',
      title: 'write-off.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/movement/pages/WriteOffView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
