<template>
  <div>
    <QPageHeader :title="$t('manager.managerList')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <ASpace>
          <AppFilter
            v-model:value="filters.name"
            :filters="filters"
            :placeholder="$t('common.searchBy.name')"
            @reset="resetFilter"
            @submit="submitFilter"
          >
            <AFormItem v-if="$canUse('Admin')" :label="$t('common.counterparty')">
              <SelectCounterparty v-model:value="filters.counterpartyId" />
            </AFormItem>
            <AFormItem :label="$t('common.mail')">
              <AInput v-model:value="filters.email" allow-clear />
            </AFormItem>
            <AFormItem :label="$t('common.warehouse')" name="warehouseId">
              <SelectWarehouse
                :key="filters.counterpartyId"
                v-model:value="filters.warehouseId"
                :filters="{ counterpartyId: filters.counterpartyId }"
                mode="multiple"
              />
            </AFormItem>
            <AFormItem :label="$t('common.phone')">
              <AInput
                v-model:value="filters.phone"
                allow-clear
              />
            </AFormItem>
          </AppFilter>
        </ASpace>
      </template>
      <template #extra>
        <AddLink :to="{ name: 'UserManager.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.managers"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'name'">
            <RouterLink class="flex items-center" :to="{ name: 'UserManager.View', params: { managerId: record.id } }">
              <AAvatar class="bg-primary-100 text-primary-500 font-medium mr-2" shape="square">
                {{ getInitials(text) }}
              </AAvatar>
              <SingleDescription :description="record.email">
                {{ text }}
              </SingleDescription>
            </RouterLink>
          </template>

          <template v-else-if="column.dataIndex === 'warehouses'">
            <div class="space-y-2">
              <div
                v-for="item in record.warehouses"
                :key="item.id"
              >
                <ATag class="whitespace-normal">
                  {{ item.title }}
                </ATag>
              </div>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <ATag :color="record.status.color">
              {{ $t(record.status.title) }}
            </ATag>
          </template>

          <TableActions
            v-if="column.dataIndex === 'action'"
            :actions="actions"
            :record="record"
          />
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import { getInitials } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { Manager } from '../manager.model';
import type { ManagerFilters } from '../manager.dto';
import { ManagerRepository } from '../manager.repository';
import type { TableAction, TableColumnProps } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  name: '',
  counterpartyId: null,
  warehouseId: [],
  email: '',
  phone: '',
}));

const { t } = useI18n();

const actions: TableAction<Manager>[] = [
  {
    to: record => ({ name: 'UserManager.View', params: { managerId: record.id } }),
    title: t('common.view'),
  },
  {
    to: record => ({ name: 'UserManager.Edit', params: { managerId: record.id } }),
    title: t('action.edit'),
  },
];

const columns = computed((): TableColumnProps[] => {
  return [
    {
      title: t('common.firstName'),
      dataIndex: 'name',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
    },
    {
      title: t('common.phone'),
      dataIndex: 'phone',
      ellipsis: true,
    },
    {
      title: t('common.warehouses'),
      dataIndex: 'warehouses',
    },
    {
      dataIndex: 'action',
      width: 50,
    },
  ];
});

watch(
  () => filters.counterpartyId,
  () => {
    filters.warehouseId = [];
  },
);

const state = reactive({
  managers: [] as Manager[],
});
const pagination = usePagination();
const loadingState = useLoading();

function resetFilter() {
  resetFilters();
  submitFilter();
}

onRouteChangeSubmit(submitFilter);

function submitFilter() {
  fetchManagers({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchManagers(params?: ManagerFilters) {
  Executor.run({
    request: ManagerRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.managers = data.list;
    },
  });
}
</script>
