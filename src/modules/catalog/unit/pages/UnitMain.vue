<template>
  <div>
    <QPageHeader :title="$t('common.units')" />

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
        <AddLink v-if="$canUse(['Admin', 'Manager'])" :to="{ name: 'CatalogUnit.Add' } " />
      </template>
      <QTable
        :columns="columns"
        :data-source="state.units"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <ATag :color="record.type.color">
              {{ $t(record.type.title) }}
            </ATag>
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
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { UnitRepository } from '@/modules/catalog/unit/unit.repository';
import type { Unit } from '@/shared/models/unit.model';
import type { UnitFilters } from '@/modules/catalog/unit/unit.dto';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';
import type { TableAction } from '@/types.js';
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
    title: t('common.description'),
    dataIndex: 'alias',
    ellipsis: true,
  },
  {
    title: t('common.unitType'),
    dataIndex: 'type',
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
        name: 'CatalogUnit.Edit',
        params: { unitId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  units: [] as Unit[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchUnits({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchUnits(params?: UnitFilters) {
  Executor.run({
    request: UnitRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.units = data.list;
    },
  });
}
</script>
