<template>
  <div>
    <ARow class="mb-4" :gutter="[10, 10]">
      <ACol class="mr-auto">
        <AddLink
          class="mr-2"
          :to="{ name: 'Movement.Product.Add' }"
          type="dashed"
        >
          {{ $t('movement.addProductToCatalog') }}
        </AddLink>
        <AButton @click="state.isHelpModalVisible = true">
          <QuestionCircleOutlined />
          {{ $t('common.help') }}
        </AButton>
      </ACol>
      <ACol>
        <AButton
          :disabled="!state.targetKeys.length"
          type="primary"
          @click="onSubmit"
        >
          {{ $t('action.save') }}
        </AButton>
      </ACol>
    </ARow>

    <ATransfer
      v-model:target-keys="state.targetKeys"
      class="ant-transfer--size-30-70 ant-transfer--headerless"
      :data-source="state.products"
      :locale="antdLocale"
      :show-select-all="false"
      :titles="getTitles"
      @change="onChangeTransfer"
      @select-change="onSelectChangeTransfer"
    >
      <template
        #children="{
          direction,
          disabled: listDisabled,
          selectedKeys,
          onItemSelect,
          onItemSelectAll,
        }"
      >
        <div v-if="direction === 'left'" class="flex p-3 items-center">
          <ARow :gutter="10">
            <ACol :flex="1">
              <ATooltip placement="topLeft" :title="$t('movement.updateProductCatalog')">
                <AButton :disabled="!canReloadProducts || loadingState.isLoading.value" @click="reloadProducts">
                  <ReloadOutlined />
                </AButton>
              </ATooltip>
            </ACol>
            <ACol :flex="1">
              <AppFilter
                v-model:value="filters.title"
                :filters="filters"
                :placeholder="$t('common.searchBy.name')"
                @reset="resetFilter(onItemSelectAll)"
                @submit="submitFilter(onItemSelectAll)"
              >
                <AFormItem :label="$t('common.searchBy.category')">
                  <SearchProductCategory
                    v-model:value="filters.categoryId"
                    :placeholder="$t('common.searchBy.category')"
                  >
                    <template #prefix>
                      <ATypographyText type="secondary">
                        <SearchOutlined />
                      </ATypographyText>
                    </template>
                  </SearchProductCategory>
                </AFormItem>

                <AFormItem :label="$t('common.markable')">
                  <YesNoRadio v-model:value="filters.markable" />
                </AFormItem>
              </AppFilter>
            </ACol>
          </ARow>
        </div>

        <div v-if="direction === 'right'" class="flex p-3 items-center">
          <ARow :gutter="10">
            <ACol :flex="1">
              <SelectionDropdown :count="state.targetSelected.length">
                <AMenuItem @click="showMultipleChangeModal">
                  {{ $t('movement.changePlace') }}
                </AMenuItem>
                <AMenuItem @click="moveToLeft(onItemSelectAll)">
                  {{ $t('common.removeFromList') }}
                </AMenuItem>
              </SelectionDropdown>
            </ACol>
            <ACol :flex="1">
              <AppFilter
                v-model:value="staticFilters.title"
                :filters="staticFilters"
                :placeholder="$t('common.searchBy.name')"
                @reset="resetStaticFilter"
                @submit="submitStaticFilters"
              >
                <AFormItem :label="$t('common.searchBy.category')">
                  <SearchProductCategory
                    v-model:value="staticFilters.categoryId"
                    :placeholder="$t('common.searchBy.category')"
                  >
                    <template #prefix>
                      <ATypographyText type="secondary">
                        <SearchOutlined />
                      </ATypographyText>
                    </template>
                  </SearchProductCategory>
                </AFormItem>

                <AFormItem :label="$t('common.markable')">
                  <YesNoRadio v-model:value="staticFilters.markable" />
                </AFormItem>
              </AppFilter>
            </ACol>
          </ARow>
        </div>

        <ATable
          v-if="direction === 'left'"
          :columns="leftColumns"
          :custom-row="({ key, disabled: itemDisabled }) => ({
            class: itemDisabled ? 'bg-gray-50' : 'cursor-pointer',
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !selectedKeys.includes(key));
            },
          })"
          :data-source="productsAccordingTargets"
          :loading="loadingState.isLoading.value"
          :pagination="remotePagination"
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              onItemSelectAll,
              onItemSelect,
              filteredItems: productsAccordingTargets,
            })
          "
          :scroll="{ y: TRANSFER_HEIGHT, scrollToFirstRowOnChange: true }"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
          @change="onChangeTable(onItemSelectAll, $event)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <SingleDescription :description="record.category.title">
                <span :class="{ 'text-success-500': record.disabled }">{{ record.title }}</span>
              </SingleDescription>
            </template>
            <template v-else-if="column.dataIndex === 'markable'">
              {{ Format.yesno(record.markable) }}
            </template>
          </template>
        </ATable>

        <ATable
          v-else
          :columns="rightColumns"
          :data-source="state.filteredStaticItems"
          :pagination="staticPagination"
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              onItemSelectAll,
              onItemSelect,
              filteredItems: state.filteredStaticItems,
            })
          "
          :scroll="{ y: TRANSFER_HEIGHT, scrollToFirstRowOnChange: true }"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <SingleDescription
                class="cursor-pointer"
                :description="record.category.title"
                @click="onItemSelect(record.key, !selectedKeys.includes(record.key))"
              >
                {{ record.title }}
              </SingleDescription>
            </template>

            <template v-else-if="column.dataIndex === 'markable'">
              {{ Format.yesno(record.markable) }}
            </template>

            <template v-if="column.dataIndex === 'warehousePlaceSelected'">
              <SelectWarehousePlace
                :key="selectWarehousePlaceKey"
                v-model:value="record.warehousePlaceSelected"
                :filters="{ warehouseId }"
                label-in-value
              />
            </template>

            <template v-if="column.dataIndex === 'count'">
              <AFormItem
                class="mb-0"
                has-feedback
                :validate-status="record.validateStatus"
              >
                <AInputNumber
                  v-model:value="record.count"
                  :max="record.unit.type.id === UnitType.Countable.id ? MaxAmount.ReceiveProducts : MaxAmount.UncountableProducts"
                  :min="0"
                  :placeholder="$t(record.unit.title)"
                  :precision="record.unit.type.id === UnitType.Countable.id ? 0 : QUANTITY_PRECISION"
                  @change="onCountChange(record)"
                />
              </AFormItem>
            </template>
          </template>
        </ATable>
      </template>
    </ATransfer>

    <WarehousePlaceChangeModal
      :key="selectWarehousePlaceKey"
      v-model:visible="state.isMultipleChangeModalVisible"
      :warehouse-id="warehouseId"
      @submit="onMultipleChange"
    />
    <ReceiveAddHelpModal v-model:visible="state.isHelpModalVisible" />
  </div>
</template>

<script lang="ts" setup>
import type { Fn } from '@qlt2020/frutils';
import { hasString, sleep } from '@qlt2020/frutils';
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import type {
  TransferProduct,
} from './receive-transfer-table';
import {
  getRowSelection,
  leftColumns,
  prepareForTransfer,
  rightColumns,
} from './receive-transfer-table';
import { UnitType } from '@/shared/enums/status.enum';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import ReceiveAddHelpModal from '@/modules/movement/pages/component/ReceiveAddTransfer/ReceiveAddHelpModal.vue';
import { getAntdPagination, getLabelInValueId } from '@/shared/utils/utils';
import type { LabelInValueMixed } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { useAntdLocales } from '@/shared/composables/useAntdLocales';
import type { ProductFilters } from '@/modules/catalog/product/product.dto';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import { useLoading } from '@/shared/composables/useLoading';
import {
  DEFAULT_PER_PAGE,
  MaxAmount,
  QUANTITY_PRECISION,
  TABLE_MAX_UPDATE_RATE,
} from '@/shared/config/constants';
import { Executor } from '@/shared/network/executor';
import { Format } from '@/shared/utils/format';

const props = defineProps<{
  warehouseId?: LabelInValueType['value'] | null
}>();

const emit = defineEmits(['submit', 'updateRecords']);

let lastWarehouseId = props.warehouseId;
const selectWarehousePlaceKey = ref(0);
const TRANSFER_HEIGHT = 450;

// If parent warehouseId changed, then clear target warehouse places, and reset select components
onActivated(() => {
  if (lastWarehouseId !== props.warehouseId) {
    clearTargetWarehousePlaces();
    selectWarehousePlaceKey.value += 1;
    lastWarehouseId = props.warehouseId;
  }
});

const { t } = useI18n();

const route = useRoute();
const { antdLocale } = useAntdLocales();
const loadingState = useLoading();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
  categoryId: null,
  markable: undefined,
}));

const { form: staticFilters, resetForm: resetStaticFilters } = useResettableState(() => ({
  title: '',
  categoryId: null,
  markable: undefined,
}));

const state = reactive({
  products: [] as TransferProduct[],
  targetKeys: [] as string[],
  targetRecords: [] as TransferProduct[],
  filteredStaticItems: [] as TransferProduct[],
  targetSelected: [] as string[],
  isMultipleChangeModalVisible: false,
  isHelpModalVisible: false,
  currentStaticPage: 1,
});

const recordsQuantityByPage = computed(() => {
  const totalRecords = state.targetRecords.length;
  const totalPages = Math.ceil(totalRecords / DEFAULT_PER_PAGE);
  const isLastPage = state.currentStaticPage === totalPages;

  if (!totalRecords)
    return 0;

  return isLastPage
    ? (totalRecords % DEFAULT_PER_PAGE) || DEFAULT_PER_PAGE
    : DEFAULT_PER_PAGE;
});

const productsAccordingTargets = computed(() => {
  return state.products.map((product) => {
    return {
      ...product,
      disabled: state.targetKeys.includes(product.key),
    };
  });
});

const pagination = usePagination();

const remotePagination = computed(() => {
  if (!pagination || pagination.lastPage === 1)
    return false;

  return {
    ...getAntdPagination(pagination),
    showSizeChanger: false,
    showQuickJumper: true,
    showLessItems: true,
  };
});

function resetFilter(onItemSelectAll: Fn) {
  resetFilters();
  submitFilter(onItemSelectAll);
}

function resetStaticFilter() {
  resetStaticFilters();
  resetFilteredStaticItems();
}

function resetFilteredStaticItems() {
  state.filteredStaticItems = state.targetRecords;
}

function fetchProducts(params?: ProductFilters) {
  Executor.run({
    request: ProductRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.products = prepareForTransfer(data.list);
    },
  });
}

function onCountChange(record: TransferProduct) {
  record.validateStatus = '';
}

function submitFilter(onItemSelectAll?: Fn) {
  onItemSelectAll?.([], false);
  fetchProducts({ ...getPaginationParams(pagination), ...filters });
}

function submitStaticFilters() {
  state.filteredStaticItems = state.targetRecords.filter((item) => {
    const hasTitle = hasString(item.title, staticFilters.title);
    const hasCategoryId = staticFilters.categoryId ? item.category.id === staticFilters.categoryId : true;
    const isMarkable = staticFilters.markable == null || staticFilters.markable === +item.markable;

    return hasTitle && hasCategoryId && isMarkable;
  });
}

watch(
  route, () => {
    submitFilter();
  },
  { immediate: true },
);

const onChangeTable = (onItemSelectAll: Fn, tablePagination: TablePaginationConfig) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter(onItemSelectAll);
};

function validateTargetRecords() {
  let hasError = false;
  let firstErrorIndex: number | null = null;

  state.targetRecords.forEach((record, index) => {
    if (!record.count || record.count <= 0) {
      record.validateStatus = 'error';
      hasError = true;

      // Remember index of the first error, to switch to page this record lay on
      if (firstErrorIndex == null)
        firstErrorIndex = index;
    }
  });

  if (firstErrorIndex != null)
    state.currentStaticPage = Math.ceil((firstErrorIndex + 1) / DEFAULT_PER_PAGE);

  return hasError;
}

function onSubmit() {
  const hasError = validateTargetRecords();
  if (hasError)
    return message.error(t('validation.countFieldGreaterThanZero'));

  const targetValues = state.filteredStaticItems.map((product) => {
    return {
      productId: product.id,
      count: product.count,
      ...product.warehousePlaceSelected && { warehousePlaceId: getLabelInValueId(product.warehousePlaceSelected) },
    };
  });
  emit('submit', targetValues);
}

function moveToLeft(onItemSelectAll: Fn) {
  const nextTargetKeys = state.targetKeys.filter(key => !state.targetSelected.includes(key));

  setNewTargetRecords(nextTargetKeys);
  state.targetKeys = nextTargetKeys;

  onItemSelectAll([], false);
}

const canReloadProducts = ref(true);

async function reloadProducts() {
  canReloadProducts.value = false;
  submitFilter();

  await sleep(TABLE_MAX_UPDATE_RATE);

  canReloadProducts.value = true;
}

function showMultipleChangeModal() {
  state.isMultipleChangeModalVisible = true;
}

function onMultipleChange(warehousePlace: LabelInValueMixed) {
  state.targetRecords
    .filter(product => state.targetSelected.includes(product.key))
    .forEach((product) => {
      product.warehousePlaceSelected = warehousePlace;
    });

  state.isMultipleChangeModalVisible = false;
}

function onSelectChangeTransfer(sourceSelectedKeys: string[], targetSelectedKeys: string[]) {
  state.targetSelected = targetSelectedKeys;
}

const getTitles = computed(() => {
  return [`${t('common.countFromTotal', { count: productsAccordingTargets.value.length, total: pagination.total })} ${t('common.inventoryRegistry')}`, `${state.targetRecords.length ? t('common.countFromTotal', { count: recordsQuantityByPage.value, total: state.targetRecords.length }) : ''} ${t('common.productsForReceiving')}`];
});

function setNewTargetRecords(nextTargetKeys: string[]) {
  state.targetRecords = state.targetRecords
    .filter((product) => {
      if (nextTargetKeys.includes(product.key))
        return true;

      // clear data in records that have been moved to left column
      product.warehousePlaceSelected = null;
      product.count = null;
      product.validateStatus = '';
      return false;
    });

  submitStaticFilters();

  emit('updateRecords', state.targetRecords);
}

function clearTargetWarehousePlaces() {
  state.targetRecords
    .forEach((product) => {
      product.warehousePlaceSelected = null;
    });
}

function onChangeTransfer(nextTargetKeys: string[]) {
  nextTargetKeys
    .filter((key) => {
      const notExistInTarget = !state.targetRecords.some(rec => rec.key === key);
      const existInProducts = state.products.some(product => product.key === key);
      return notExistInTarget && existInProducts;
    })
    .forEach((key) => {
      const foundProduct = state.products.find(product => product.key === key)!;
      state.targetRecords.push(foundProduct);
    });

  setNewTargetRecords(nextTargetKeys);
}

function onUpdateCurrent(value: number) {
  state.currentStaticPage = value;
}

const staticPagination = computed(() => {
  if (state.targetRecords.length <= DEFAULT_PER_PAGE)
    return false;

  return {
    'pageSize': DEFAULT_PER_PAGE,
    'current': state.currentStaticPage,
    'onUpdate:current': onUpdateCurrent,
  };
});
</script>
