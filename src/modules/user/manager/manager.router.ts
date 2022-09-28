import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';
import { createCounterpartyEdit, createCounterpartyView } from '@/modules/counterparty/counterparty-info/counterparty-info.router';

const ManagerMain = () => import('@/modules/user/manager/pages/ManagerMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'managers',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),

  children: [
    {
      path: '',
      name: 'UserManager.Main',
      meta: {
        breadcrumbName: 'manager.managerList',
        title: 'manager.managerList',
      },
      component: () => import('@/modules/user/manager/pages/ManagerMain.vue'),
    },
    {
      path: getModalPath('manager', 'add'),
      name: 'UserManager.Add',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'manager.add',
        title: 'manager.add',
      },
      components: {
        default: ManagerMain,
        modal: () => import('@/modules/user/manager/pages/ManagerAdd.vue'),
      },
    },
    {
      path: getModalPath('manager', 'edit'),
      name: 'UserManager.Edit',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'manager.edit',
        title: 'manager.edit',
      },
      components: {
        default: ManagerMain,
        modal: () => import('@/modules/user/manager/pages/ManagerEdit.vue'),
      },
    },
    createManagerView(),

    createCounterpartyView({
      name: 'Manager.Counterparty.View',
      defaultComponent: ManagerMain,
    }),

    createCounterpartyEdit({
      name: 'Manager.Counterparty.Edit',
      defaultComponent: ManagerMain,
    }),
  ],
};

export function createManagerView(
  { name = 'UserManager.View', defaultComponent = ManagerMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('manager'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'manager.view',
      title: 'manager.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/user/manager/pages/ManagerView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute('User', moduleRoute);
};
