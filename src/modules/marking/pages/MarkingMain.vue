<template>
  <div>
    <QPageHeader :title="$t('common.marking')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.dateAndTime')">
            <QDateRangePicker v-model:value="filters.dateRange" show-time />
          </AFormItem>
          <AFormItem v-if="$canUse('Admin')" :label="$t('common.counterparty')">
            <SelectCounterparty v-model:value="filters.counterpartyId" />
          </AFormItem>
          <AFormItem :label="$t('common.status')">
            <SelectDocumentStatus v-model:value="filters.statusId" />
          </AFormItem>
          <AFormItem :label="$t('common.warehouse')">
            <SelectWarehouse
              :key="filters.counterpartyId"
              v-model:value="filters.warehouseId"
              :filters="{ counterparty: 1, counterpartyId: filters.counterpartyId }"
            />
          </AFormItem>
          <AFormItem :label="$t('common.responsibleEmployee')" name="respUserId">
            <SearchManager
              :key="filters.warehouseId || filters.counterpartyId"
              v-model:value="filters.respUserId"
              :filters="{ warehouseId: filters.warehouseId, counterpartyId: filters.counterpartyId }"
              :placeholder="$t('common.responsibleEmployee')"
            />
          </AFormItem>

          <AFormItem :label="$t('common.author')" name="createdUserId">
            <SearchManager
              :key="filters.warehouseId || filters.counterpartyId"
              v-model:value="filters.createdUserId"
              :filters="{ warehouseId: filters.warehouseId, counterpartyId: filters.counterpartyId }"
              :placeholder="$t('common.author')"
            />
          </AFormItem>
        </AppFilter>
      </template>
      <template #extra>
        <AddLink v-if="$canUse(['Manager'])" :to="{ name: 'Marking.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.marking"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink :to="{ name: 'Marking.View', params: { markingId: record.id } }">
              <SingleDescription :description="`${$t('common.created[0]')} ${Format.datetimeFull(record.createdDate)}`">
                #{{ record.id }} {{ record.title }}
              </SingleDescription>
            </RouterLink>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <ATag :color="record.status.color">
              {{ $t(record.status.title) }}
            </ATag>
          </template>

          <template v-if="column.dataIndex === 'warehouse'">
            <RouterLink :to="{ name: 'Marking.Warehouse.View', params: { warehouseId: record.warehouse.id } }">
              <SingleDescription :description="record.warehousePlace?.title">
                {{ text.title }}
              </SingleDescription>
            </RouterLink>
          </template>

          <template v-else-if="column.dataIndex.includes('responsibleEmployee')">
            <RouterLink :to="{ name: 'Marking.Manager.View', params: { managerId: record.responsibleEmployee.id } }">
              {{ record.responsibleEmployee.name }}
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
import type { Marking } from '../marking.model';
import { MarkingRepository } from '../marking.repository';
import type { MarkingFilters } from '../marking.dto';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import type { TableAction } from '@/types';
import { DocumentStatus } from '@/shared/enums/status.enum';
import TableActions from '@/shared/components/table/TableActions.vue';
import QDateRangePicker from '@/shared/components/qlib/QDateRangePicker.vue';
import { Format } from '@/shared/utils/format';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';
import { useUserStore } from '@/shared/store/user.store';
import { canUse } from '@/shared/utils/permissions';

const userStore = useUserStore();

const { t } = useI18n();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
  dateRange: null,
  counterpartyId: null,
  warehouseId: null,
  statusId: null,
  respUserId: null,
  createdUserId: null,
}));

const state = reactive({
  marking: [] as Marking[],
});

const columns = [
  {
    title: t('common.document'),
    dataIndex: 'title',
    ellipsis: true,
    width: 300,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    ellipsis: true,
    width: 150,
  },
  {
    title: t('common.numberOfProductsShort'),
    dataIndex: ['productStatus', 'total'],
    ellipsis: true,
    width: 100,
  },
  {
    title: t('common.warehouse'),
    dataIndex: 'warehouse',
    width: 170,
  },
  {
    title: t('common.responsible'),
    dataIndex: ['responsibleEmployee', 'name'],
    width: 170,
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
        name: 'Marking.Edit',
        params: { markingId: record.id },
      }),
    title: t('action.edit'),
    condition: (record) => {
      return record.status.id === DocumentStatus.Created.id && record.author.id === userStore.current.id && canUse('Manager');
    },
  },
  {
    to: record => (
      {
        name: 'Marking.View',
        params: { markingId: record.id },
      }),
    title: t('common.view'),
  },
]);

watch(
  () => filters.warehouseId,
  () => {
    filters.respUserId = null;
    filters.createdUserId = null;
  },
);

watch(
  () => filters.counterpartyId,
  () => {
    filters.warehouseId = null;
    filters.respUserId = null;
    filters.createdUserId = null;
  },
);

const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchMarking({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchMarking(params?: MarkingFilters) {
  Executor.run({
    request: MarkingRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.marking = data.list;
    },
  });
}
</script>
