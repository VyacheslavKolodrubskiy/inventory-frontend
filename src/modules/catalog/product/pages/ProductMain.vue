<template>
  <div>
    <QPageHeader :title="$t('common.inventoryRegistry')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.productCategory')">
            <SearchProductCategory v-model:value="filters.categoryId" />
          </AFormItem>

          <AFormItem :label="$t('common.unit')">
            <SelectUnit v-model:value="filters.unitId" />
          </AFormItem>

          <AFormItem :label="$t('common.markable')">
            <YesNoRadio v-model:value="filters.markable" />
          </AFormItem>
        </AppFilter>
      </template>

      <template #extra>
        <template v-if="$canUse(['Admin', 'Manager'])">
          <AddLink
            class="mr-2"
            :to="{ name: 'Product.Add' }"
          />
          <QLink :to="{ name: 'Product.Import' }">
            <DownloadOutlined />
            {{ $t('action.import') }}
          </QLink>
        </template>
      </template>
      <QTable
        :columns="columns"
        :data-source="state.products"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink :to="{ name: 'Product.View', params: { productId: record.id } }">
              {{ text }}
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex === 'unitType'">
            <ATag :color="record.unit.type.color">
              {{ $t(record.unit.type.title) }}
            </ATag>
          </template>
          <template v-else-if="column.dataIndex === 'markable'">
            {{ Format.yesno(record.markable) }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <TableActions :actions="actions" :record="record" />
          </template>
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table';
import { Format } from '@/shared/utils/format';
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import type { Product } from '@/modules/catalog/product/product.model';
import type { ProductFilters } from '@/modules/catalog/product/product.dto';
import TableActions from '@/shared/components/table/TableActions.vue';
import { canUse } from '@/shared/utils/permissions';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
  categoryId: null,
  unitId: null,
  markable: undefined,
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('common.productCategory'),
    dataIndex: ['category', 'title'],
    ellipsis: true,
  },
  {
    title: t('common.unitShort'),
    dataIndex: ['unit', 'title'],
    ellipsis: true,
  },
  {
    title: t('common.unitType'),
    dataIndex: 'unitType',
    ellipsis: true,
  },
  {
    title: t('common.markable'),
    dataIndex: 'markable',
  },
  {
    title: t('common.vendorCode'),
    dataIndex: 'articular',
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
        name: 'Product.Edit',
        params: { productId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
  {
    to: record => (
      {
        name: 'Product.View',
        params: { productId: record.id },
      }),
    title: t('common.view'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  products: [] as Product[],
});
const pagination = usePagination();
const loadingState = useLoading();

function submitFilter() {
  fetchProducts({ ...getPaginationParams(pagination), ...filters });
}

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchProducts(params?: ProductFilters) {
  Executor.run({
    request: ProductRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}
</script>
