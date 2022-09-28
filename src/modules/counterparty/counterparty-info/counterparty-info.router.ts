import type { RouteRecordRaw, Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';
import { getModalPath } from '@/shared/utils/router-utils';

const CounterpartyMain = () => import('@/modules/counterparty/counterparty-info/pages/CounterpartyMain.vue');

const moduleCounterparties: RouteRecordRaw = {
  path: 'counterparties',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Counterparty.Main',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'counterparty-info.counterpartyList',
        title: 'counterparty-info.counterpartyList',
      },
      component: CounterpartyMain,
    },
    {
      path: getModalPath('counterparty', 'add'),
      name: 'Counterparty.Add',
      meta: {
        breadcrumbName: 'counterparty-info.add',
        title: 'counterparty-info.add',
      },
      components: {
        default: CounterpartyMain,
        modal: () => import('@/modules/counterparty/counterparty-info/pages/CounterpartyAdd.vue'),
      },
    },

    createCounterpartyView(),
    createCounterpartyEdit(),
  ],
};

const moduleCounterpartyInfo: RouteRecordRaw = {
  path: 'info',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Counterparty.Info',
      meta: {
        permissions: ['Manager'],
        breadcrumbName: 'counterparty-info.view',
        title: 'counterparty-info.view',
      },
      component: () => import('@/modules/counterparty/counterparty-info/pages/CounterpartyInfo.vue'),
    },
  ],
};

export function createCounterpartyEdit(
  { name = 'Counterparty.Edit', defaultComponent = CounterpartyMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('counterparty'),
    name,
    meta: {
      breadcrumbName: 'counterparty-info.edit',
      title: 'counterparty-info.edit',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/counterparty/counterparty-info/pages/CounterpartyEdit.vue'),
    },
  };
}

export function createCounterpartyView(
  { name = 'Counterparty.View', defaultComponent = CounterpartyMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('counterparty'),
    name,
    meta: {
      breadcrumbName: 'counterparty-info.view',
      title: 'counterparty-info.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/counterparty/counterparty-info/pages/CounterpartyView.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleCounterparties);
  router.addRoute('Counterparty', moduleCounterpartyInfo);
};

