<template>
  <div>
    <QPageHeader :title="$t('warehouse.title')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <ASpace>
          <AppFilter
            v-model:value="filters.title"
            :filters="filters"
            :placeholder="$t('common.searchBy.name')"
            @reset="resetFilter"
            @submit="submitFilter"
          >
            <AFormItem v-if="$canUse('Admin')" :label="$t('common.counterparty')">
              <SelectCounterparty v-model:value="filters.counterpartyId" />
            </AFormItem>
            <AFormItem :label="$t('common.warehousePlace')">
              <AInput
                v-model:value="filters.warehousePlaceTitle"
                allow-clear
                :placeholder="$t('common.searchBy.place')"
              />
            </AFormItem>
            <AFormItem :label="$t('common.region')">
              <SearchRegion v-model:value="filters.regionId" />
            </AFormItem>
            <AFormItem :label="$t('common.city')">
              <SearchCity
                :key="filters.regionId"
                v-model:value="filters.cityId"
                :filters="{ regionId: filters.regionId }"
              />
            </AFormItem>
          </AppFilter>
        </ASpace>
      </template>
      <template #extra>
        <ADropdown :trigger="['click']">
          <AddButton />
          <template #overlay>
            <AMenu>
              <AMenuItem v-if="$canUse(['Admin'])">
                <RouterLink :to="{ name: 'Warehouse.Add' }">
                  {{ $t('warehouse.addWarehouse') }}
                </RouterLink>
              </AMenuItem>
              <AMenuItem v-if="$canUse(['Admin', 'Manager'])">
                <RouterLink :to="{ name: 'WarehousePlace.Add' }">
                  {{ $t('warehouse.addPlace') }}
                </RouterLink>
              </AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </template>
      <QTable
        v-model:expanded-row-keys="expanded"
        :columns="columns"
        :data-source="state.warehousesAndPlaces"
        expand-row-by-click
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        :row-expandable="(record: any) => record.warehousePlaces && record.warehousePlaces.length"
        @change="onChangeTable"
      >
        <template #expandedRowRender="{ record }">
          <AList
            bordered
            class="ml-8 bg-white"
            :data-source="record.warehousePlaces"
            size="small"
          >
            <template #renderItem="{ item }">
              <AListItem>
                <RouterLink :to="{ name: 'WarehousePlace.View', params: { warehousePlaceId: item.id } }">
                  <SingleDescription :description="item.description">
                    {{ item.title }}
                  </SingleDescription>
                </RouterLink>

                <template #extra>
                  <TableActions :actions="innerActions" :record="item" />
                </template>
              </AListItem>
            </template>
            <template #header>
              {{ $t('common.warehousePlaces') }}
            </template>
          </AList>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'action'">
            <TableActions
              :actions="actions"
              :record="record"
              @click.stop
            />
          </template>
          <template v-else-if="column.dataIndex === 'title'">
            <RouterLink :to="{ name: 'Warehouse.View', params: { warehouseId: record.id } }" @click.stop>
              {{ text }}
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex.includes('city')">
            <SingleDescription :description="record.city.region.title">
              {{ text }}
            </SingleDescription>
          </template>
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table';
import { WarehouseRepository } from '../warehouse.repository';
import type { WarehouseFilters } from '../warehouse.dto';
import type { Warehouse } from '../warehouse.model';
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';
import { canUse } from '@/shared/utils/permissions';

const { form: filters, resetForm: resetFilters } = useResettableState<WarehouseFilters>(() => ({
  title: '',
  counterpartyId: null,
  warehousePlaceTitle: '',
  description: '',
  cityId: null,
  regionId: null,
}));

const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();

const innerActions = ref<TableAction[]>([
  {
    to: record => ({
      name: 'WarehousePlace.Edit',
      params: { warehousePlaceId: record.id },
    }),
    title: t('action.edit'),
  },
  {
    to: record => ({
      name: 'WarehousePlace.View',
      params: { warehousePlaceId: record.id },
    }),
    title: t('common.view'),
  },
]);

const actions = ref<TableAction[]>([
  {
    to: record => ({
      name: 'Warehouse.Edit',
      params: { warehouseId: record.id },
    }),
    title: t('action.edit'),
    condition: () => canUse('Admin'),
  },
  {
    to: record => ({
      name: 'Warehouse.View',
      params: { warehouseId: record.id },
    }),
    title: t('common.view'),
  },
]);

const columns = [
  {
    title: t('common.warehouse'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('common.description'),
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: t('common.city'),
    dataIndex: ['city', 'title'],
  },
  {
    dataIndex: 'action',
    width: 50,
  },
];

const state = reactive({
  warehousesAndPlaces: [] as Warehouse[],
});

const expanded = ref<number[]>([]);

onRouteChangeSubmit(submitFilter);

watch(() => filters.regionId, () => {
  filters.cityId = null;
});

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchWarehousesAndPlaces({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchWarehousesAndPlaces(params?: WarehouseFilters) {
  Executor.run({
    request: WarehouseRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      expanded.value = data.list.map(el => el.id);
      state.warehousesAndPlaces = data.list;
    },
  });
}
</script>
