<template>
  <div>
    <QPageHeader :title="$t('common.productCategories')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        />
      </template>

      <template #extra>
        <AddLink v-if="$canUse(['Admin', 'Manager'])" :to="{ name: 'CatalogProductCategory.Add' } " />
      </template>
      <QTable
        :columns="columns"
        :data-source="state.productCategories"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableActions :actions="actions" :record="record" />
          </template>
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';
import type { ProductCategory } from '@/modules/catalog/product-category/product-category.model';
import type { ProductCategoryFilters } from '@/modules/catalog/product-category/product-category.dto';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';
import type { TableAction } from '@/types';
import { canUse } from '@/shared/utils/permissions';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    dataIndex: 'action',
    width: 50,
  },
];

const actions = ref<TableAction[]>([
  {
    to: record => (
      {
        name: 'CatalogProductCategory.Edit',
        params: { productCategoryId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  productCategories: [] as ProductCategory[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchProductCategories({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchProductCategories(params?: ProductCategoryFilters) {
  Executor.run({
    request: ProductCategoryRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.productCategories = data.list;
    },
  });
}
</script>
