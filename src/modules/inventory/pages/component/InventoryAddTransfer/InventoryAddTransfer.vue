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
      class="ant-transfer--headerless"
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
                <AFormItem :label="$t('common.productCategory')">
                  <SearchProductCategory v-model:value="filters.productCategoryId" />
                </AFormItem>
                <AFormItem :label="$t('common.searchBy.place')">
                  <SelectWarehousePlace
                    v-model:value="filters.warehousePlaceId"
                    :filters="{ warehouseId }"
                  />
                </AFormItem>
                <AFormItem :label="$t('common.productMarked')">
                  <YesNoRadio v-model:value="filters.markId" />
                </AFormItem>
              </AppFilter>
            </ACol>
          </ARow>
        </div>

        <AppFilter
          v-if="direction === 'right'"
          v-model:value="staticFilters.title"
          class="p-3"
          :filters="staticFilters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetStaticFilter"
          @submit="submitStaticFilters"
        >
          <AFormItem :label="$t('common.productCategory')">
            <SearchProductCategory
              v-model:value="staticFilters.categoryId"
            />
          </AFormItem>
          <AFormItem :label="$t('common.searchBy.place')">
            <SelectWarehousePlace
              v-model:value="staticFilters.warehousePlaceId"
              :filters="{ warehouseId }"
            />
          </AFormItem>
          <AFormItem :label="$t('common.productMarked')">
            <YesNoRadio v-model:value="staticFilters.markId" />
          </AFormItem>
        </AppFilter>

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
              <div class="flex items-center">
                <MarkingStatus class="mr-2" :marked="record.isMarked" />
                <SingleDescription :description="record.category.title">
                  <span :class="{ 'text-success-500': record.disabled }">{{ record.title }}</span>
                </SingleDescription>
              </div>
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
          </template>
        </ATable>
      </template>
    </ATransfer>

    <InventoryAddHelpModal v-model:visible="state.isHelpModalVisible" />
  </div>
</template>

<script lang="ts" setup>
import type { LabelInValueType } from 'ant-design-vue/es/vc-select/Select';
import InventoryAddHelpModal from './InventoryAddHelpModal.vue';
import { useAntdLocales } from '@/shared/composables/useAntdLocales';
import { TRANSFER_HEIGHT, useProductTransfer } from '@/shared/composables/useProductTransfer';
import { i18n } from '@/i18n';

const props = defineProps<{
  warehouseId: LabelInValueType['value'] | null
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
    dataIndex: ['warehousePlace', 'title'],
    title: i18n.t('common.warehousePlace'),
  },
];

const rightColumns = [
  {
    dataIndex: 'title',
    title: i18n.t('common.name'),
    width: 250,
  },
  {
    dataIndex: ['warehousePlace', 'title'],
    title: i18n.t('common.warehousePlace'),
  },
];

const {
  state,
  filters,
  staticFilters,
  getRowSelection,
  submitFilter,
  resetFilter,
  submitStaticFilters,
  resetStaticFilter,
  moveToLeft,
  onChangeTable,
  onSelectChangeTransfer,
  onChangeTransfer,
  reloadProducts,
  canReloadProducts,
  remotePagination,
  staticPagination,
  loadingState,
  pagination,
  productsAccordingTargets,
} = useProductTransfer(emit, {
  initialWarehouseId: props.warehouseId,
});

onMounted(() => {
  submitFilter();
});

const getTitles = computed(() => {
  return [
    `${t('common.countFromTotal', { count: productsAccordingTargets.value.length, total: pagination.total })} ${t('common.productRegistry')}`,
    `${state.targetRecords.length ? t('common.totalNumber', { total: state.targetRecords.length }) : ''} ${t('common.productsForInventory')}`,
  ];
});

function onSubmit() {
  const targetValues = state.filteredStaticItems.map((product) => {
    return product.id;
  });

  emit('submit', targetValues);
}
</script>
