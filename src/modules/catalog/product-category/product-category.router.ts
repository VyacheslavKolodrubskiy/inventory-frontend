import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';

const ProductCategoryMain = () => import('@/modules/catalog/product-category/pages/ProductCategoryMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'product-categories',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'CatalogProductCategory.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'common.productCategories',
        title: 'common.productCategories',
      },
      component: ProductCategoryMain,
    },

    {
      path: getModalPath('product-category', 'add'),
      name: 'CatalogProductCategory.Add',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'product-category.add',
        title: 'product-category.add',
      },
      components: {
        default: ProductCategoryMain,
        modal: () => import('@/modules/catalog/product-category/pages/ProductCategoryAdd.vue'),
      },
    },

    {
      path: getModalPath('product-category', 'edit'),
      name: 'CatalogProductCategory.Edit',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'product-category.edit',
        title: 'product-category.edit',
      },
      components: {
        default: ProductCategoryMain,
        modal: () => import('@/modules/catalog/product-category/pages/ProductCategoryEdit.vue'),
      },
    },

  ],
};

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
