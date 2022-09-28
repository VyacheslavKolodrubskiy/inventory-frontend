<template>
  <QPageHeader :title="$t('common.statistics')" />

  <div v-if="!loadingState.isLoading.value" class="p-4">
    <ARow
      :gutter="[20, 20]"
    >
      <template v-if="$canUse('Admin')">
        <ACol :xs="24">
          <ADivider class="pb-2">
            {{ $t('statistics.commonStatisticsByCounterparty') }}
          </ADivider>
          <QTable
            :columns="commonStatisticsColumns"
            :data-source="state.commonStatistics"
            :loading="loadingState.isLoading.value"
            :pagination="false"
            :scroll="undefined"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex.includes('counterparty')">
                <RouterLink :to="{ name: 'Statistics.Counterparty.View', params: { counterpartyId: record.counterparty.id } }">
                  {{ record.counterparty.title }}
                </RouterLink>
              </template>
            </template>
          </QTable>
        </ACol>
        <ACol :xs="24">
          <ADivider>
            {{ $t('statistics.detailedCounterpartyStatistics') }}
          </ADivider>
        </ACol>
        <ACol
          :md="6"
          :xl="4"
          :xs="12"
        >
          <SelectCounterparty v-model:value="filters.counterpartyId" />
        </ACol>
        <ACol
          :md="6"
          :xl="4"
          :xs="12"
        >
          <SelectWarehouse
            :key="filters.counterpartyId"
            v-model:value="filters.warehouseId"
            :disabled="!filters.counterpartyId"
            :filters="{ counterpartyId: filters.counterpartyId }"
            @change="submitFilters"
          />
        </ACol>
      </template>
    </ARow>

    <ACol
      v-if="$canUse(['Manager'])"
      :xl="6"
      :xs="24"
    >
      <SelectWarehouse
        v-model:value="filters.warehouseId"
        :filters="{ counterparty: 1 }"
        @change="submitFilters"
      />
    </ACol>

    <ARow
      v-if="state.detailedStatistics"
      class="mt-4"
      :gutter="[20, 20]"
    >
      <template v-if="filters.counterpartyId || $canUse('Manager')">
        <ACol
          :xs="24"
          :xxl="12"
        >
          <ARow
            class="h-full"
            :gutter="[20, 20]"
          >
            <ACol :sm="12" :xs="24">
              <ACard class="chart-card h-full">
                <div class="chart-card__header">
                  <div>
                    <div class="chart-card__subtitle">
                      {{ $t('statistics.productsTotalAmount') }}
                    </div>
                    <div class="chart-card__total">
                      {{ state.detailedStatistics.totalProducts }}
                    </div>
                  </div>

                  <ATooltip>
                    <template #title>
                      <!-- TODO Change -->
                      {{ $t('statistics.productsTotalAmount') }}
                    </template>
                    <InfoCircleOutlined class="chart-card__help" />
                  </ATooltip>
                </div>
              </ACard>
            </ACol>
            <ACol :sm="12" :xs="24">
              <ACard class="chart-card h-full">
                <div class="chart-card__header">
                  <div>
                    <div class="chart-card__subtitle">
                      {{ $t('statistics.productsMarkable') }}
                    </div>
                    <div class="chart-card__total">
                      {{ state.detailedStatistics.totalMarkableProducts }}
                    </div>
                  </div>

                  <ATooltip>
                    <template #title>
                      <!-- TODO Change -->
                      {{ $t('statistics.productsMarkable') }}
                    </template>
                    <InfoCircleOutlined class="chart-card__help" />
                  </ATooltip>
                </div>
              </ACard>
            </ACol>
            <ACol
              :sm="24"
            >
              <ACard class="chart-card  h-full">
                <div class="chart-card__header">
                  <div>
                    <div class="text-4 font-bold">
                      {{ $t('statistics.byTidBardcode') }}
                    </div>
                  </div>

                  <ATooltip>
                    <template #title>
                      <!-- TODO CHANGE -->
                      {{ $t('statistics.byTidBardcode') }}
                    </template>
                    <InfoCircleOutlined class="chart-card__help" />
                  </ATooltip>
                </div>
                <PieChart
                  v-bind="state.detailedStatistics.tidBarcodeConfig"
                />
              </ACard>
            </ACol>
            <ACol
              :sm="24"
            >
              <ACard class="chart-card h-full">
                <div class="chart-card__header">
                  <div>
                    <div class="text-4 font-bold">
                      {{ $t('statistics.byMarkableProducts') }}
                    </div>
                  </div>

                  <ATooltip>
                    <template #title>
                      <!-- TODO CHANGE -->
                      {{ $t('statistics.byMarkableProducts') }}
                    </template>
                    <InfoCircleOutlined class="chart-card__help" />
                  </ATooltip>
                </div>

                <PieChart
                  v-bind="state.detailedStatistics.markableConfig"
                  class="w-full"
                />
              </ACard>
            </ACol>
          </ARow>
        </ACol>
        <ACol
          :sm="24"
          :xxl="12"
        >
          <ARow
            :gutter="[20, 20]"
            wrap
          >
            <ACol
              :sm="24"
            >
              <ACard class="chart-card">
                <PieChart
                  v-bind="warehouseProductPieConfig"
                  class="w-full"
                  :data="state.warehouseProducts"
                />
              </ACard>
            </ACol>
            <ACol
              :sm="24"
            >
              <ACard class="chart-card">
                <div class="chart-card__header">
                  <div>
                    <div class="text-4 font-bold">
                      {{ $t('statistics.byUnit') }}
                    </div>
                  </div>

                  <ATooltip placement="leftTop">
                    <template #title>
                      <!-- TODO CHANGE -->
                      {{ $t('statistics.byUnit') }}
                    </template>
                    <InfoCircleOutlined class="chart-card__help" />
                  </ATooltip>
                </div>
                <PieChart
                  v-bind="state.detailedStatistics.unitConfig"
                  class="w-full"
                />
              </ACard>
            </ACol>
          </ARow>
        </ACol>
        <ACol
          :sm="24"
        >
          <ADivider class="pb-2">
            {{ $t('statistics.latestDocuments') }}
          </ADivider>
          <QTable
            :columns="documentColumns"
            :data-source="state.latestDocuments"
            :loading="loadingState.isLoading.value"
            :pagination="false"
            :scroll="undefined"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'title'">
                <RouterLink class="flex items-center" :to="getRouteThePage(record, 'View', 'Statistics')">
                  <template v-if="DocumentIconMap[record.type.id]">
                    <Component
                      :is="DocumentIconMap[record.type.id].icon"
                      class="mr-2.5 text-lg"
                      :class="DocumentIconMap[record.type.id].class"
                      :title="$t(record.type.title)"
                    />
                  </template>
                  <SingleDescription :description="`${$t('common.created[0]')} ${Format.datetimeFull(record.createdDate)}`">
                    #{{ record.id }} {{ record.title }}
                  </SingleDescription>
                </RouterLink>
              </template>

              <template v-else-if="column.dataIndex === 'warehouses'">
                <div class="leading-tight">
                  <div v-if="record.fromWarehouse">
                    <span class="text-xs text-gray-400 mr-1">{{ $t('common.from') }}</span>
                    {{ record.fromWarehouse.title }}
                  </div>
                  <div v-if="record.toWarehouse">
                    <span class="text-xs text-gray-400 mr-1">{{ $t('common.to') }}</span>
                    {{ record.toWarehouse.title }}
                  </div>
                </div>
              </template>

              <template v-else-if="column.dataIndex === 'status'">
                <ATag :color="record.status.color">
                  {{ $t(record.status.title) }}
                </ATag>
              </template>
            </template>
          </QTable>
        </ACol>
      </template>
    </ARow>
  </div>
</template>

<script setup lang="ts">
import { PieChart } from '@opd/g2plot-vue';
import type { PieOptions } from '@antv/g2plot';
import type { Nullable } from '@qlt2020/frutils';
import { BarcodeOutlined, BuildOutlined, DownloadOutlined, ExportOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { StatisticsRepository } from '../statistics.repository';
import type { CommonStatisticsFilters, DetailedStatisticsFilters } from '../statistics.dto';
import type { CommonStatistics, DocumentStatistics } from '../statistics.model';
import type { ConvertedDetailedStatistics } from '../types';
import { getDetailedStatistics } from '../composables/getDetailedStatistics';
import { convertPercentLabel } from '../utils';
import type { TableColumnProps } from '@/types';
import { useLoading } from '@/shared/composables/useLoading';
import { Format } from '@/shared/utils/format';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor, LoadingType } from '@/shared/network/executor';
import { canUse } from '@/shared/utils/permissions';
import { DocumentType } from '@/shared/enums/status.enum';
import { getRouteThePage } from '@/shared/utils/utils';

const DocumentIconMap: Record<number, any> = {
  [DocumentType.Receive.id]: {
    icon: DownloadOutlined,
    class: 'text-success-500',
  },
  [DocumentType.Relocation.id]: {
    icon: ExportOutlined,
    class: 'text-warning-500',
  },
  [DocumentType.WriteOff.id]: {
    icon: UploadOutlined,
    class: 'text-error-500',
  },
  [DocumentType.Marking.id]: {
    icon: BarcodeOutlined,
    class: 'text-blue-500',
  },
  [DocumentType.Inventory.id]: {
    icon: BuildOutlined,
    class: 'text-purple-500',
  },
};

const loadingState = useLoading();

const { t } = useI18n();

interface State {
  commonStatistics: CommonStatistics[]
  latestDocuments: DocumentStatistics[]
  detailedStatistics: Nullable<ConvertedDetailedStatistics>
  warehouseProducts: any
}

const state = reactive<State>({
  commonStatistics: [],
  latestDocuments: [],
  detailedStatistics: null,
  warehouseProducts: [],
});

const { form: filters } = useResettableState<DetailedStatisticsFilters>(() => ({
  counterpartyId: null,
  warehouseId: null,
}));

watch(() => filters.counterpartyId, () => {
  filters.warehouseId = null;
  submitFilters();
});

function fetchByCounterparty(params?: CommonStatisticsFilters) {
  Executor.run({
    request: StatisticsRepository.fetchByCounterparty(params),
    loadingState,
    loadingType: LoadingType.Global,
    onResult(data) {
      state.commonStatistics = data;
    },
  });
}

function fetchDetailedStatistics(params?: DetailedStatisticsFilters) {
  Executor.run({
    request: StatisticsRepository.fetchDetailed(params),
    loadingType: LoadingType.Global,
    onResult(data) {
      state.detailedStatistics = getDetailedStatistics(data);
    },
  });
}

function fetchLatestDocuments(params?: DetailedStatisticsFilters) {
  Executor.run({
    request: StatisticsRepository.fetchLatestDocuments(params),
    loadingType: LoadingType.Global,
    onResult(data) {
      state.latestDocuments = data;
    },
  });
}

function fetchWarehouseProductsStatistics(params?: DetailedStatisticsFilters) {
  Executor.run({
    request: StatisticsRepository.fetchWarehouseProducts(params),
    loadingType: LoadingType.Global,
    onResult(data) {
      state.warehouseProducts = data.map(el => ({
        type: el.warehouseName, value: el.total, percent: el.percentage,
      }));
    },
  });
}

function submitFilters() {
  fetchDetailedStatistics(filters);
  fetchWarehouseProductsStatistics(filters);
  fetchLatestDocuments({ counterpartyId: filters.counterpartyId });
}

onMounted(() => {
  if (canUse('Admin'))
    fetchByCounterparty();

  else if (canUse('Manager'))
    submitFilters();
});

const warehouseProductPieConfig: Omit<PieOptions, 'data'> = {
  height: 340,
  angleField: 'value',
  colorField: 'type',
  radius: 0.8,
  innerRadius: 0.7,
  label: {
    type: 'inner',
    offset: '-50%',
    content: ({ percent }) => {
      return convertPercentLabel(percent * 100);
    },
    style: {
      textAlign: 'center',
      fontSize: 10,
    },
  },
  tooltip: {
    customContent: (title, item) => {
      if (item[0]) {
        return `<div class="py-2 px-1 flex items-center">
        <div class="w-2 h-2 mr-2 rounded-full" style="background: ${item[0].color}"></div>
        ${title}: ${convertPercentLabel(item[0].data.percent)} ${item[0].value}
        </div>`;
      }

      return title;
    },
  },
  legend: {
    maxWidth: 0,
    maxItemWidth: 230,
    max: 2,
    itemName: {
      formatter: (value) => {
        const val = value.slice(0, 15).concat('...');
        return val;
      },
      style: {
        fontSize: 13,
      },
    },
    itemValue: {
      alignRight: true,
      formatter: (value) => {
        const items = state.warehouseProducts.filter((d: any) => d.type === value);
        const val = `${convertPercentLabel(items[0].percent)}  ${items[0].value}`;
        return `${val}`;
      },
      style: {
        opacity: 0.65,
      },
    },
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  statistic: {
    title: {
      content: t('statistics.productsInWarehouses'),
    },
    content: false,
  },
};

const commonStatisticsColumns: TableColumnProps[] = [
  {
    dataIndex: ['counterparty', 'title'],
    title: t('common.counterparty'),
  },
  {
    dataIndex: 'productsCount',
    title: t('common.numberOfProducts'),
  },
  {
    dataIndex: 'markedProductsCount',
    title: t('statistics.markedProducts'),
  },
  {
    dataIndex: 'warehousesCount',
    title: t('common.warehousesCount'),
  },
];

const documentColumns: TableColumnProps[] = [
  {
    dataIndex: 'title',
    title: t('common.document'),
  },
  {
    dataIndex: 'status',
    title: t('common.status'),
  },
  {
    dataIndex: 'productAmount',
    title: t('common.numberOfProductsShort'),
  },
  {
    dataIndex: 'warehouses',
    title: t('common.warehouse'),
  },
  {
    dataIndex: 'responsibleUserName',
    title: t('common.responsible'),
  },
];
</script>
