import type { RouteRecordRaw, Router } from 'vue-router';
import { createCounterpartyEdit, createCounterpartyView } from '../counterparty/counterparty-info/counterparty-info.router';
import { createReceiveView, createRelocationView, createWriteOffView } from '../movement/movement.router';
import { createMarkingView } from '../marking/marking.router';
import { createInventoryView } from '../inventory/inventory.router';
import { PageName } from '@/shared/enums/common.enum';

const StatisticsMain = () => import('@/modules/statistics/pages/StatisticsMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'statistics',
  name: 'Statistics',
  redirect: { name: 'Statistics.Main' },
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  meta: {
    breadcrumbName: 'common.statistics',
    title: 'common.main',
  },
  children: [
    {
      path: '',
      name: 'Statistics.Main',
      meta: {
        title: 'common.statistics',
      },
      component: StatisticsMain,
    },
    createCounterpartyView({
      name: 'Statistics.Counterparty.View',
      defaultComponent: StatisticsMain,
    }),
    createRelocationView({
      name: 'Statistics.Relocation.View',
      defaultComponent: StatisticsMain,
    }),
    createReceiveView({
      name: 'Statistics.Receive.View',
      defaultComponent: StatisticsMain,
    }),
    createInventoryView({
      name: 'Statistics.Inventory.View',
      defaultComponent: StatisticsMain,
    }),
    createMarkingView({
      name: 'Statistics.Marking.View',
      defaultComponent: StatisticsMain,
    }),
    createWriteOffView({
      name: 'Statistics.WriteOff.View',
      defaultComponent: StatisticsMain,
    }),
    createCounterpartyEdit({
      name: 'Statistics.Counterparty.Edit',
      defaultComponent: StatisticsMain,
    }),
  ],
};

export default (router: Router) => {
  router.addRoute(PageName.BASE_LAYOUT, moduleRoute);
};
