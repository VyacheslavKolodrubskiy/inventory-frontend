<template>
  <div>
    <ARow class="mb-4" :gutter="[10, 10]">
      <ACol class="mr-auto">
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
      :data-source="state.products"
      :locale="antdLocale"
      :show-select-all="false"
      :titles="[` ${$t('common.productRegistry')}`, ` ${$t('common.productsForRelocation')}`]"
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
              <ATooltip placement="topLeft" :title="$t('product-registry.updateRegistry')">
                <AButton :disabled="!canReloadProducts || loadingState.isLoading.value" @click="reloadProducts">
                  <ReloadOutlined />
                </AButton>
              </ATooltip>
            </ACol>
            <ACol :flex="1">
              <AppFilter
                v-model:value="filters.productTitle"
                :filters="filters"
                :placeholder="$t('common.searchBy.name')"
                @reset="resetFilter(onItemSelectAll)"
                @submit="submitFilter(onItemSelectAll)"
              >
                <AFormItem :label="$t('common.searchBy.category')">
                  <SearchProductCategory v-model:value="filters.productCategoryId" />
                </AFormItem>
                <AFormItem :label="$t('common.searchBy.place')">
                  <SelectWarehousePlace
                    v-model:value="filters.warehousePlaceId"
                    :filters="{ warehouseId: fromWarehouseId }"
                  />
                </AFormItem>
                <AFormItem :label="$t('common.productMarked')">
                  <YesNoRadio v-model:value="filters.markId" />
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
                  />
                </AFormItem>
                <AFormItem :label="$t('common.productMarked')">
                  <YesNoRadio v-model:value="staticFilters.markId" />
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
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'title'">
              <div class="flex items-center">
                <MarkingStatus class="mr-2" :marked="record.isMarked" />
                <SingleDescription :description="record.category.title">
                  <span :class="{ 'text-success-500': record.disabled }">{{ record.title }}</span>
                </SingleDescription>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'amount'">
              <SingleDescription :description="record.unit.title">
                {{ text }}
              </SingleDescription>
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
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'title'">
              <div class="flex items-center">
                <MarkingStatus class="mr-2" :marked="record.isMarked" />
                <SingleDescription
                  class="cursor-pointer"
                  :description="record.category.title"
                  @click="onItemSelect(record.key, !selectedKeys.includes(record.key))"
                >
                  {{ record.title }}
                </SingleDescription>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'amount'">
              <SingleDescription v-if="record.unit.type.id === UnitType.Countable.id" :description="record.unit.title">
                {{ text }}
              </SingleDescription>
              <template v-else>
                <AFormItem
                  class="mb-0"
                  has-feedback
                  :validate-status="record.validateStatus"
                >
                  <AInputNumber
                    v-model:value="record.count"
                    :max="record.amount"
                    :min="0"
                    :placeholder="$t(record.unit.title)"
                    :precision="QUANTITY_PRECISION"
                    @change="onCountChange(record)"
                  />
                </AFormItem>
              </template>
            </template>
          </template>
        </ATable>
      </template>
    </ATransfer>

    <WarehousePlaceChangeModal
      v-model:visible="state.isMultipleChangeModalVisible"
      :warehouse-id="toWarehouseId"
      @submit="onMultipleChange"
    />

    <RelocationAddHelpModal v-model:visible="state.isHelpModalVisible" />
  </div>
</template>

<script lang="ts" setup>
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import RelocationAddHelpModal from './RelocationAddHelpModal.vue';
import { i18n } from '@/i18n';
import { TRANSFER_HEIGHT, useProductTransfer } from '@/shared/composables/useProductTransfer';
import { useAntdLocales } from '@/shared/composables/useAntdLocales';
import { QUANTITY_PRECISION } from '@/shared/config/constants';
import { UnitType } from '@/shared/enums/status.enum';
import { getLabelInValueId } from '@/shared/utils/utils';

const props = defineProps<{
  fromWarehouseId: LabelInValueType['value'] | null
  toWarehouseId: LabelInValueType['value'] | null
}>();

const emit = defineEmits(['submit', 'updateRecords']);

const { t } = useI18n();
const { antdLocale } = useAntdLocales();

const leftColumns = [
  {
    dataIndex: 'title',
    title: i18n.t('common.name'),
    width: 250,
  },
  {
    dataIndex: 'amount',
    title: i18n.t('common.amount'),
  },
];
const rightColumns = [
  {
    dataIndex: 'title',
    title: i18n.t('common.name'),
    width: 250,
  },
  {
    dataIndex: 'amount',
    title: i18n.t('common.amount'),
  },
];

const {
  state,
  filters,
  staticFilters,
  getRowSelection,
  onCountChange,
  submitFilter,
  resetFilter,
  submitStaticFilters,
  resetStaticFilter,
  validateTargetRecords,
  moveToLeft,
  onChangeTable,
  onSelectChangeTransfer,
  showMultipleChangeModal,
  onMultipleChange,
  onChangeTransfer,
  reloadProducts,
  canReloadProducts,
  remotePagination,
  staticPagination,
  loadingState,
  productsAccordingTargets,
} = useProductTransfer(emit, {
  initialWarehouseId: props.fromWarehouseId,
});

onMounted(() => {
  submitFilter();
});

function onSubmit() {
  const hasError = validateTargetRecords();
  if (hasError)
    return message.error(t('validation.notEnoughAmountToRelocate'));

  const targetValues = state.filteredStaticItems.map((product) => {
    return {
      warehouseProductId: product.id,
      ...product.count && { amount: product.count },
    };
  });

  emit('submit', targetValues);
}
</script>
