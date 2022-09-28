<template>
  <div>
    <QPageHeader :title="$t('city.headerTitle')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.region')">
            <SearchRegion v-model:value="filters.regionId" />
          </AFormItem>
        </AppFilter>
      </template>
      <template #extra>
        <AddLink v-if="$canUse(['Admin', 'Manager'])" :to="{ name: 'CatalogCity.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.cities"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink :to="{ name: 'CatalogCity.View', params: { cityId: record.id } }">
              {{ text }}
            </RouterLink>
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
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import type { City } from '@/modules/catalog/city/city.model';
import { CityRepository } from '@/modules/catalog/city/city.repository';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import type { CityFilters } from '@/modules/catalog/city/city.dto';
import { canUse } from '@/shared/utils/permissions';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters, resetField: resetFilterField } = useResettableState(() => ({
  title: '',
  regionId: null,
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('common.region'),
    dataIndex: ['region', 'title'],
    ellipsis: true,
  },
  {
    title: t('common.country'),
    dataIndex: ['region', 'country', 'title'],
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
        name: 'CatalogCity.Edit',
        params: { cityId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
  {
    to: record => (
      {
        name: 'CatalogCity.View',
        params: { cityId: record.id },
      }),
    title: t('common.view'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  cities: [] as City[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchCities({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchCities(params?: CityFilters) {
  Executor.run({
    request: CityRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.cities = data.list;
    },
  });
}
</script>
