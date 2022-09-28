import type { RouteRecordRaw, Router } from 'vue-router';
import { getModalPath } from '@/shared/utils/router-utils';
import { MODAL_URL_PREFIX } from '@/shared/config/constants';

const ProductMain = () => import('@/modules/catalog/product/pages/ProductMain.vue');

const moduleRoute: RouteRecordRaw = {
  path: 'products',
  component: () => import('@/shared/components/TheEmptyRouterViewWithModal.vue'),
  children: [
    {
      path: '',
      name: 'Product.Main',
      meta: {
        permissions: ['Admin', 'Manager'],
        breadcrumbName: 'common.inventoryRegistry',
        title: 'common.inventoryRegistry',
      },
      component: ProductMain,
    },

    createProductAdd(),
    createProductView(),
    createProductEdit(),
    createProductImport(),
  ],
};

export function createProductAdd(
  { name = 'Product.Add', defaultComponent = ProductMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('product', 'add'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'product.add',
      title: 'product.add',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/product/pages/ProductAdd.vue'),
    },
  };
}

export function createProductView(
  { name = 'Product.View', defaultComponent = ProductMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('product'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'product.view',
      title: 'product.view',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/product/pages/ProductView.vue'),
    },
  };
}

export function createProductEdit(
  { name = 'Product.Edit', defaultComponent = ProductMain } = {},
): RouteRecordRaw {
  return {
    path: getModalPath('product', 'edit'),
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'product.edit',
      title: 'product.edit',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/product/pages/ProductEdit.vue'),
    },
  };
}

export function createProductImport(
  { name = 'Product.Import', defaultComponent = ProductMain } = {},
): RouteRecordRaw {
  return {
    path: `${MODAL_URL_PREFIX}/product/import`,
    name,
    meta: {
      permissions: ['Admin', 'Manager'],
      breadcrumbName: 'product.import',
      title: 'product.import',
    },
    components: {
      default: defaultComponent,
      modal: () => import('@/modules/catalog/product/pages/ProductImport.vue'),
    },
  };
}

export default (router: Router) => {
  router.addRoute('Catalog', moduleRoute);
};
