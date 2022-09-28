<template>
  <div>
    <QPageHeader :title="$t('counterparty-info.counterpartyList')" />

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
            <AFormItem :label="$t('common.abbr.iinBin')">
              <AInput v-model:value="filters.bin" allow-clear />
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
            <AFormItem :label="$t('common.address')">
              <AInput v-model:value="filters.address" allow-clear />
            </AFormItem>
            <AFormItem :label="$t('common.phone')">
              <AInput
                v-model:value="filters.phone"
                allow-clear
              />
            </AFormItem>
            <AFormItem :label="$t('common.mail')">
              <AInput v-model:value="filters.email" allow-clear />
            </AFormItem>
          </AppFilter>
        </ASpace>
      </template>
      <template #extra>
        <AddLink v-if="$canUse(['Admin'])" :to="{ name: 'Counterparty.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.counterparties"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink class="flex items-center" :to="{ name: 'Counterparty.View', params: { counterpartyId: record.id } }">
              <AAvatar class="bg-primary-100 text-primary-500 font-medium mr-2" shape="square">
                {{ getInitials(text) }}
              </AAvatar>
              <SingleDescription :description="record.email">
                {{ text }}
              </SingleDescription>
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex.includes('city')">
            <SingleDescription :description="record.city.region.title">
              {{ text }}
            </SingleDescription>
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
import { CounterpartyInfoRepository } from '../counterparty-info.repository';
import type { CounterpartyInfo } from '../counterparty-info.model';
import type { CounterpartyInfoFilters } from '../counterparty-info.dto';
import type { TableAction, TableColumnProps } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
  bin: '',
  address: '',
  email: '',
  phone: '',
  cityId: null,
  regionId: null,
}));

const { t } = useI18n();

const actions: TableAction<CounterpartyInfo>[] = [
  {
    to: record => ({ name: 'Counterparty.Edit', params: { counterpartyId: record.id } }),
    title: t('action.edit'),
  },
  {
    to: record => ({ name: 'Counterparty.View', params: { counterpartyId: record.id } }),
    title: t('common.view'),
  },
];

const columns = computed((): TableColumnProps[] => {
  return [
    {
      title: t('common.name'),
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: t('common.abbr.iinBin'),
      dataIndex: 'bin',
      ellipsis: true,
    },
    {
      title: t('common.city'),
      dataIndex: ['city', 'title'],
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      dataIndex: 'action',
      width: 50,
    },
  ];
});

const state = reactive({
  counterparties: [] as CounterpartyInfo[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

watch(() => filters.regionId, () => {
  filters.cityId = null;
});

function submitFilter() {
  fetchCounterparties({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchCounterparties(params?: CounterpartyInfoFilters) {
  Executor.run({
    request: CounterpartyInfoRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.counterparties = data.list;
    },
  });
}
</script>
