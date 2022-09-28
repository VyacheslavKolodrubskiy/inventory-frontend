import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const CountryMain = () => import('@/modules/catalog/country/pages/CountryMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'countries',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'CatalogCountry.Main',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'common.countries',
        title: 'common.countries',
      },
      component: CountryMain,
    },

    {
      path: getModalPath('country', 'add'),
      name: 'CatalogCountry.Add',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'country.add',
        title: 'country.add',
      },
      components: {
        default: CountryMain,
        modal: () => import('@/modules/catalog/country/pages/CountryAdd.vue'),
      },
    },

    {
      path: getModalPath('country', 'edit'),
      name: 'CatalogCountry.Edit',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'country.edit',
        title: 'country.edit',
      },
      components: {
        default: CountryMain,
        modal: () => import('@/modules/catalog/country/pages/CountryEdit.vue'),
      },
    },
  ],
};

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
