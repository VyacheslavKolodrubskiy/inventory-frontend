<template>
  <div>
    <QPageHeader :title="$t('common.productRegistry')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.productTitle"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.productCategory')">
            <SearchProductCategory v-model:value="filters.productCategoryId" />
          </AFormItem>

          <AFormItem v-if="$canUse('Admin')" :label="$t('common.counterparty')">
            <SelectCounterparty v-model:value="filters.counterpartyId" />
          </AFormItem>

          <AFormItem :label="$t('common.warehouse')">
            <SelectWarehouse
              :key="filters.counterpartyId"
              v-model:value="filters.warehouseId"
              :filters="{ counterpartyId: filters.counterpartyId }"
            />
          </AFormItem>

          <AFormItem :label="$t('common.warehousePlaces')">
            <SelectWarehousePlace
              :key="filters.warehouseId || filters.counterpartyId"
              v-model:value="filters.warehousePlaceId"
              :filters="{ warehouseId: filters.warehouseId, counterpartyId: filters.counterpartyId }"
            />
          </AFormItem>

          <AFormItem :label="$t('common.abbr.mol')">
            <SearchManager
              :key="filters.warehouseId || filters.counterpartyId"
              v-model:value="filters.liabilityUserId"
              :filters="{ warehouseId: filters.warehouseId, counterpartyId: filters.counterpartyId }"
            />
          </AFormItem>

          <AFormItem :label="$t('common.productMarked')">
            <YesNoRadio v-model:value="filters.markId" />
          </AFormItem>

          <AFormItem :label="$t('common.markable')">
            <YesNoRadio v-model:value="filters.markable" />
          </AFormItem>
        </AppFilter>
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
            <RouterLink class="flex items-center" :to="{ name: 'RegistryProduct.View', params: { productId: record.id } }">
              <MarkingStatus class="mr-2" :marked="record.isMarked" />
              <SingleDescription :description="record.category.title">
                {{ text }}
              </SingleDescription>
            </RouterLink>
          </template>

          <template v-if="column.dataIndex === 'amount'">
            <SingleDescription :description="record.unit.title">
              {{ text }}
            </SingleDescription>
          </template>

          <template v-else-if="column.dataIndex === 'markable'">
            {{ Format.yesno(record.markable) }}
          </template>

          <template v-else-if="column.dataIndex.includes('unit')">
            <ATag :color="text.color">
              {{ $t(text.title) }}
            </ATag>
          </template>

          <template v-else-if="column.dataIndex.includes('warehouse')">
            <RouterLink :to="{ name: 'RegistryProduct.Warehouse.View', params: { warehouseId: record.warehouse.id } }">
              <SingleDescription :description="record.warehousePlace?.title">
                {{ text }}
              </SingleDescription>
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex.includes('liabilityUser')">
            <RouterLink v-if="record.liabilityUser" :to="{ name: 'RegistryProduct.Manager.View', params: { managerId: record.liabilityUser.id } }">
              {{ text }}
            </RouterLink>
          </template>
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table';
import { Format } from '@/shared/utils/format';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { RegistryProductRepository } from '@/shared/repository/registry-product.repository';
import type { RegistryProduct } from '@/shared/models/registry-product.model';
import type { RegistryProductFilters } from '@/shared/dto/registry-product.dto';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  counterpartyId: null,
  warehouseId: null,
  warehousePlaceId: null,
  liabilityUserId: null,
  markId: undefined,
  markable: undefined,
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('common.quantityShort'),
    dataIndex: 'amount',
    width: 100,
  },
  {
    title: t('common.warehouse'),
    dataIndex: ['warehouse', 'title'],
  },
  {
    title: t('common.abbr.mol'),
    dataIndex: ['liabilityUser', 'name'],
  },
  {
    title: t('common.markable'),
    dataIndex: 'markable',
  },
];

watch(
  () => filters.warehouseId,
  () => {
    filters.liabilityUserId = null;
    filters.warehousePlaceId = null;
  },
);

watch(
  () => filters.counterpartyId,
  () => {
    filters.warehouseId = null;
    filters.warehousePlaceId = null;
    filters.liabilityUserId = null;
  },
);

const state = reactive({
  products: [] as RegistryProduct[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchProducts({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchProducts(params?: RegistryProductFilters) {
  Executor.run({
    request: RegistryProductRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}
</script>
