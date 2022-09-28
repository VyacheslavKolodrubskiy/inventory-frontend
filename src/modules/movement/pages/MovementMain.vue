<template>
  <div>
    <QPageHeader :title="$t('common.productMovement')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <AppFilter
          v-model:value="filters.title"
          :filters="filters"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.dateAndTime')">
            <QDateRangePicker v-model:value="filters.dateRange" show-time />
          </AFormItem>

          <AFormItem v-if="$canUse('Admin')" :label="$t('common.counterparty')">
            <SelectCounterparty v-model:value="filters.counterpartyId" />
          </AFormItem>

          <AFormItem :label="$t('common.documentType')">
            <SelectMovementType v-model:value="filters.typeId" />
          </AFormItem>

          <AFormItem :label="$t('common.status')">
            <SelectDocumentStatus v-model:value="filters.statusId" />
          </AFormItem>

          <AFormItem :label="$t('common.warehouses')">
            <SelectWarehouse
              :key="filters.counterpartyId"
              v-model:value="filters.warehouseIds"
              :filters="{ counterparty: 1, counterpartyId: filters.counterpartyId }"
              mode="multiple"
            />
          </AFormItem>

          <AFormItem :label="$t('common.author')">
            <SearchManager
              :key="filters.warehouseIds || filters.counterpartyId"
              v-model:value="filters.user"
              :filters="{ warehouseId: filters.warehouseIds, counterpartyId: filters.counterpartyId }"
              :placeholder="$t('common.author')"
            />
          </AFormItem>

          <AFormItem :label="$t('common.responsibleEmployee')">
            <SearchManager
              :key="filters.warehouseIds || filters.counterpartyId"
              v-model:value="filters.responsibleEmployee"
              :filters="{ warehouseId: filters.warehouseIds, counterpartyId: filters.counterpartyId }"
              :placeholder="$t('common.responsibleEmployee')"
            />
          </AFormItem>
        </AppFilter>
      </template>

      <QTable
        :columns="columns"
        :data-source="state.movements"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink class="flex items-center" :to="getRouteThePage(record, 'View')">
              <template v-if="MovementIconMap[record.type.id]">
                <Component
                  :is="MovementIconMap[record.type.id].icon"
                  class="mr-2.5 text-lg"
                  :class="MovementIconMap[record.type.id].class"
                  :title="$t(record.type.title)"
                />
              </template>
              <SingleDescription :description="`${$t('common.created[0]')} ${Format.datetimeFull(record.createdDate)}`">
                #{{ record.id }} {{ record.title }}
                {{ record.type.id === MovementType.WriteOff.id ? `- ${$t(record.writeOffType.title).toLocaleLowerCase()}` : '' }}
              </SingleDescription>
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <ATag :color="record.status.color">
              {{ $t(record.status.title) }}
            </ATag>
          </template>
          <template v-else-if="column.dataIndex === 'warehouses'">
            <div class="leading-tight">
              <div v-if="record.fromWarehouse">
                <span class="text-xs text-gray-400 mr-1">{{ $t('common.from') }}</span>
                <RouterLink :to="{ name: 'Movement.Warehouse.View', params: { warehouseId: record.fromWarehouse.id } }">
                  {{ record.fromWarehouse.title }}
                </RouterLink>
              </div>
              <div v-if="record.toWarehouse">
                <span class="text-xs text-gray-400 mr-1">{{ $t('common.to') }}</span>
                <RouterLink :to="{ name: 'Movement.Warehouse.View', params: { warehouseId: record.toWarehouse.id } }">
                  {{ record.toWarehouse.title }}
                </RouterLink>
              </div>
            </div>
          </template>
          <template v-else-if="column.dataIndex.includes('responsibleEmployee')">
            <RouterLink :to="{ name: 'Movement.Manager.View', params: { managerId: record.responsibleEmployee.id } }">
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
import DownloadOutlined from '@ant-design/icons-vue/lib/icons/DownloadOutlined';
import ExportOutlined from '@ant-design/icons-vue/lib/icons/ExportOutlined';
import UploadOutlined from '@ant-design/icons-vue/lib/icons/UploadOutlined';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import SelectDocumentStatus from '../../../shared/components/form/SelectDocumentStatus.vue';
import SelectMovementType from '../../../shared/components/form/SelectMovementType.vue';
import type { Movement } from '@/modules/movement/movement.model';
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { MovementRepository } from '@/modules/movement/movement.repository';
import type { MovementFilters } from '@/modules/movement/movement.dto';
import TableActions from '@/shared/components/table/TableActions.vue';
import { Format } from '@/shared/utils/format';
import { DocumentStatus, MovementType, WriteOffType } from '@/shared/enums/status.enum';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';
import { useUserStore } from '@/shared/store/user.store';
import { canUse } from '@/shared/utils/permissions';
import { getRouteThePage } from '@/shared/utils/utils';

const userStore = useUserStore();

const { t } = useI18n();

const MovementIconMap: Record<number, any> = {
  [MovementType.Receive.id]: {
    icon: DownloadOutlined,
    class: 'text-success-500',
  },
  [MovementType.Relocation.id]: {
    icon: ExportOutlined,
    class: 'text-warning-500',
  },
  [MovementType.WriteOff.id]: {
    icon: UploadOutlined,
    class: 'text-error-500',
  },
};

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
  dateRange: null,
  typeId: null,
  counterpartyId: null,
  warehouseIds: [],
  statusId: null,
  user: '',
  responsibleEmployee: '',
}));

const columns = [
  {
    title: t('common.document'),
    dataIndex: 'title',
    width: 300,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    width: 150,
  },
  {
    title: t('common.numberOfProductsShort'),
    dataIndex: 'productAmount',
    width: 100,
  },
  {
    title: t('common.warehouse'),
    dataIndex: 'warehouses',
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
      getRouteThePage(record, 'Edit')),
    title: t('action.edit'),
    condition: record => record.status.id === DocumentStatus.Created.id
      && record.author.id === userStore.current.id
      && canUse('Manager')
      && record.writeOffType.id !== WriteOffType.Automatic.id,
  },
  {
    to: record => (
      getRouteThePage(record, 'View')),
    title: t('common.view'),
  },
]);

watch(
  () => filters.warehouseIds,
  () => {
    filters.responsibleEmployee = '';
    filters.user = '';
  },
);

watch(
  () => filters.counterpartyId,
  () => {
    filters.warehouseIds = [];
    filters.responsibleEmployee = '';
    filters.user = '';
  },
);

const state = reactive({
  movements: [] as Movement[],
});
const pagination = usePagination();
const loadingState = useLoading();

function submitFilter() {
  fetchMovements({ ...getPaginationParams(pagination), ...filters });
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

function fetchMovements(params?: MovementFilters) {
  Executor.run({
    request: MovementRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.movements = data.list;
    },
  });
}
</script>
