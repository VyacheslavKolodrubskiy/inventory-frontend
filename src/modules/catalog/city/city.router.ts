import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const CityMain = () => import('@/modules/catalog/city/pages/CityMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'cities',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'CatalogCity.Main',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'city.title',
        title: 'city.title',
      },
      component: CityMain,
    },
    {
      path: getModalPath('city', 'add'),
      name: 'CatalogCity.Add',
      meta: {
        permissions: ['Admin'],
        breadcrumbName: 'city.add',
        title: 'city.add',
      },
      components: {
        default: CityMain,
        modal: () => import('@/modules/catalog/city/pages/CityAdd.vue'),
      },
    },

    createCityView(),
    createCityEdit(),
  ],
};

export function createCityView(
  { name = 'CatalogCity.View', defaultComponent = CityMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('city'),
    name,
    meta: {
      permissions: ['Admin'],
      breadcrumbName: 'city.view',
      title: 'city.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/city/pages/CityView.vue'),
    },
  };
}

export function createCityEdit(
  { name = 'CatalogCity.Edit', defaultComponent = CityMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('city', 'edit'),
    name,
    meta: {
      permissions: ['Admin'],
      breadcrumbName: 'city.edit',
      title: 'city.edit',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/city/pages/CityEdit.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
