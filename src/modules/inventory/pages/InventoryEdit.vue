<template>
  <div>
    <QPageHeader>
      <template #title>
        <DocumentTitle
          v-if="inventoryData"
          :id="inventoryData.id"
          :title="inventoryData.title"
          type="inventory"
        />
      </template>

      <ATypographyText type="secondary">
        {{ $t('common.warehouse') }}
      </ATypographyText>
      {{ inventoryData?.warehouse.title }}
    </QPageHeader>
    <ACard>
      <InventoryForm
        :data-id="dataId"
        @submit="onSubmitMovement"
        @update-movement="onUpdateInventory"
      />

      <ADivider>
        {{ $t('common.productList') }}
        <ATooltip :title="$t('message.productListAutoSaving')">
          <ATag class="ml-1" color="green">
            <SaveOutlined />
            {{ $t('common.autoSave') }}
          </ATag>
        </ATooltip>
      </ADivider>
      <div class="flex">
        <SelectionDropdown
          class="mr-3"
          :count="state.selectedRowKeys.length"
          :disabled="loadingState.isLoading.value"
        >
          <AMenuItem @click="confirmRemoveProducts">
            {{ $t('movement.deleteFromList') }}
          </AMenuItem>
        </SelectionDropdown>

        <AppFilter
          v-model:value="filters.productTitle"
          class="mb-3"
          :filters="filters"
          :placeholder="$t('common.searchBy.name')"
          @reset="resetFilter"
          @submit="submitFilter"
        >
          <AFormItem :label="$t('common.productCategory')">
            <SearchProductCategory v-model:value="filters.productCategoryId" />
          </AFormItem>

          <AFormItem :label="$t('common.searchBy.place')">
            <SelectWarehousePlace
              v-model:value="filters.warehousePlaceId"
            />
          </AFormItem>

          <AFormItem :label="$t('common.productMarked')">
            <YesNoRadio v-model:value="filters.markId" />
          </AFormItem>
        </AppFilter>
      </div>

      <ATable
        :columns="columns"
        :data-source="state.products"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        row-key="id"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        size="small"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <div class="flex items-center">
              <MarkingStatus class="mr-2" :marked="record.isMarked" />
              <SingleDescription :description="record.category.title">
                {{ text }}
              </SingleDescription>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <ATag :color="record.status.color">
              {{ $t(record.status.title) }}
            </ATag>
          </template>

          <template v-else-if="column.dataIndex === 'amount'">
            <SingleDescription :description="record.unit.title">
              {{ text }}
            </SingleDescription>
          </template>

          <template v-else-if="column.dataIndex === 'action'">
            <APopconfirm
              :cancel-text="$t('common.no')"
              :ok-text="$t('common.yes')"
              :title="$t('message.confirmRemoveProduct')"
              @confirm="removeProducts([record.id])"
            >
              <DeleteButton />
            </APopconfirm>
          </template>
        </template>
      </ATable>
    </ACard>
  </div>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { Key } from 'ant-design-vue/es/vc-table/interface';
import type { InventoryProductFilters, RemoveInventoryProductDto, UpdateInventoryDto } from '../inventory.dto';
import type { Inventory } from '../inventory.model';
import InventoryForm from '@/modules/inventory/pages/component/InventoryForm.vue';
import { InventoryRepository } from '@/modules/inventory/inventory.repository';
import { DocumentStatus } from '@/shared/enums/status.enum';
import type { EntityID, LabelInValueMixed } from '@/types';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { createLabelInValue } from '@/shared/utils/utils';
import { useResettableState } from '@/shared/composables/useResettableState';
import type { InventoryProduct } from '@/shared/models/registry-product.model';
import { useUserStore } from '@/shared/store/user.store';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();

interface ReceiveProductRow extends InventoryProduct {
  warehousePlaceSelected: LabelInValueMixed
}
const dataId = computed(() => route.params.inventoryId as string);
const inventoryData = ref<Nullable<Inventory>>(null);

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  warehousePlaceId: null,
  productCategoryId: null,
  markId: undefined,
}));

const state = reactive({
  products: [] as ReceiveProductRow[],
  selectedRowKeys: [] as EntityID[],
  isMultipleChangeModalVisible: false,
});

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    width: 250,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    ellipsis: true,
  },
  {
    title: t('common.amount'),
    dataIndex: 'amount',
    ellipsis: true,
  },
  {
    title: t('common.warehousePlace'),
    dataIndex: ['warehousePlace', 'title'],
    width: 240,
    ellipsis: true,
  },
  {
    dataIndex: 'action',
    width: 50,
  },
];

function onUpdateInventory(inventory: Inventory) {
  if (inventory.status?.id !== DocumentStatus.Created.id || userStore.current.id !== inventory.author.id)
    router.replace({ name: 'Inventory.Main' });

  inventoryData.value = inventory;
}

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchProducts(dataId.value, { ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys as EntityID[];
};

function confirmRemoveProducts() {
  Modal.confirm({
    title: t('movement.removingProducts'),
    content: t('message.confirmRemoveProducts'),
    okText: t('common.yes'),
    cancelText: t('common.no'),
    onOk() {
      removeProducts(state.selectedRowKeys);
      state.selectedRowKeys = [];
    },
  });
}

function fetchProducts(id: UrlParam, params?: InventoryProductFilters) {
  Executor.run({
    request: InventoryRepository.fetchProducts(id, params),
    pagination,
    loadingState,
    onResult(data) {
      state.products = data.list.map((item) => {
        return {
          ...item,
          warehousePlaceSelected: createLabelInValue(item.warehousePlace?.title, item.warehousePlace?.id),
        };
      });
    },
  });
}

function onSubmitMovement(values: UpdateInventoryDto) {
  Executor.run({
    request: InventoryRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
  });
}

function removeProducts(keys: RemoveInventoryProductDto) {
  Executor.run({
    request: InventoryRepository.deleteProducts(dataId.value, keys),
    loadingState,
    messageType: MessageType.Deleted,
    onResult() {
      if (keys.length === 1)
        state.selectedRowKeys = state.selectedRowKeys.filter(key => key !== keys[0]);

      submitFilter();
    },
  });
}

submitFilter();
</script>
