<template>
  <div>
    <QPageHeader :title="$t('region.headerTitle')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.country')">
            <AInput v-model:value="filters.countryTitle" allow-clear />
          </AFormItem>
        </AppFilter>
      </template>

      <template #extra>
        <AddLink v-if="$canUse(['Admin', 'Manager'])" :to="{ name: 'CatalogRegion.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.regions"
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
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { RegionRepository } from '@/modules/catalog/region/region.repository';
import type { Region } from '@/modules/catalog/region/region.model';
import type { RegionFilters } from '@/modules/catalog/region/region.dto';
import { canUse } from '@/shared/utils/permissions';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters, resetField: resetFilterField } = useResettableState(() => ({
  title: '',
  countryTitle: '',
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('common.country'),
    dataIndex: ['country', 'title'],
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
        name: 'CatalogRegion.Edit',
        params: { regionId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  regions: [] as Region[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchRegions({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchRegions(params?: RegionFilters) {
  Executor.run({
    request: RegionRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.regions = data.list;
    },
  });
}
</script>
