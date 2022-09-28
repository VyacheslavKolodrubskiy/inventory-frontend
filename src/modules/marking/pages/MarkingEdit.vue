<template>
  <div>
    <QPageHeader>
      <template #title>
        <DocumentTitle
          v-if="markingData"
          :id="markingData.id"
          :title="markingData.title"
          type="marking"
        />
      </template>

      <ATypographyText type="secondary">
        {{ $t('common.warehouse') }}
      </ATypographyText>
      {{ markingData?.warehouse.title }}
    </QPageHeader>

    <ACard>
      <MarkingForm
        :data-id="dataId"
        @submit="onSubmitMarking"
        @update-marking="onUpdateMarking"
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
          <AMenuItem @click="showMultipleChangeModal">
            {{ $t('movement.changePlace') }}
          </AMenuItem>
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
            <SearchProductCategory
              v-model:value="filters.productCategoryId"
              allow-clear
              :placeholder="$t('common.searchBy.category')"
            />
          </AFormItem>
          <AFormItem :label="$t('common.warehousePlace')">
            <SelectWarehousePlace
              v-model:value="filters.warehousePlaceId"
              :filters="{ warehouseId: markingData?.warehouse.id }"
            />
          </AFormItem>
          <AFormItem :label="$t('common.productMarked')">
            <YesNoRadio v-model:value="filters.markId" />
          </AFormItem>
          <AFormItem :label="$t('common.markable')">
            <YesNoRadio v-model:value="filters.markable" />
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

          <template v-else-if="column.dataIndex === 'markable'">
            {{ Format.yesno(record.markable) }}
          </template>

          <template v-else-if="column.dataIndex === 'warehousePlace'">
            <SelectWarehousePlace
              v-if="editableProduct && record.id === editableProduct.id"
              ref="selectWarehousePlaceRef"
              v-model:value="editableProduct.warehousePlaceSelected"
              :allow-clear="false"
              :filters="{ warehouseId }"
              @change="changeWarehousePlace(record)"
            />
            <template v-else>
              <ASpace v-if="record.warehousePlace">
                <ATypographyLink @click.prevent="editWarehouse(record)">
                  <EditOutlined class="mr-1" /> {{ record.warehousePlace.title }}
                </ATypographyLink>

                <ATooltip :title="$t('action.detachWarehousePlace')">
                  <AButton
                    class="ant-btn-icon-only"
                    danger
                    type="text"
                    @click="deleteWarehouse(record)"
                  >
                    <CloseOutlined />
                  </AButton>
                </ATooltip>
              </ASpace>

              <ATypographyLink v-else @click.prevent="editWarehouse(record)">
                <PlusOutlined /> {{ $t('action.addWarehousePlace') }}
              </ATypographyLink>
            </template>
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

    <WarehousePlaceChangeModal
      v-model:visible="state.isMultipleChangeModalVisible"
      :warehouse-id="warehouseId"
      @submit="onMultipleChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { Key } from 'ant-design-vue/es/vc-table/interface';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import { onClickOutside } from '@vueuse/core';
import type { Marking } from '../marking.model';
import type { MarkingProductFilters, UpdateMarkingDto, UpdateMarkingProductDto } from '../marking.dto';
import { MarkingRepository } from '../marking.repository';
import MarkingForm from './component/MarkingForm.vue';
import { Format } from '@/shared/utils/format';
import type { EntityID, LabelInValueMixed } from '@/types';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { useResettableState } from '@/shared/composables/useResettableState';
import type { MarkingProduct } from '@/shared/models/registry-product.model';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { DocumentStatus } from '@/shared/enums/status.enum';
import WarehousePlaceChangeModal from '@/shared/components/modal/WarehousePlaceChangeModal.vue';
import { useUserStore } from '@/shared/store/user.store';
import SearchProductCategory from '@/shared/components/form/SearchProductCategory.vue';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();

interface MarkingProductRow extends MarkingProduct {
  warehousePlaceSelected: LabelInValueMixed
}
const dataId = computed(() => route.params.markingId as string);
const markingData = ref<Nullable<Marking>>(null);
const selectWarehousePlaceRef = ref(null);
const editableProduct = ref<MarkingProductRow | null>(null);
const warehouseId = computed(() => markingData.value?.warehouse.id);

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  warehousePlaceId: null,
  markId: undefined,
  markable: undefined,
}));

onClickOutside(selectWarehousePlaceRef, (_event) => {
  editableProduct.value = null;
}, { capture: false });

const state = reactive({
  products: [] as MarkingProductRow[],
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
    title: t('common.markable'),
    dataIndex: 'markable',
  },
  {
    title: t('common.warehousePlace'),
    dataIndex: 'warehousePlace',
    width: 240,
    ellipsis: true,
  },
  {
    dataIndex: 'action',
    width: 50,
  },
];

function onUpdateMarking(marking: Marking) {
  if (marking.status.id !== DocumentStatus.Created.id || userStore.current.id !== marking.author.id)
    router.replace({ name: 'Marking.Main' });

  markingData.value = marking;
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

function changeWarehousePlace(product: MarkingProductRow) {
  onChangeProduct([
    {
      productId: product.id,
      warehousePlaceId: getLabelInValueId(product.warehousePlaceSelected) ?? null,
    },
  ]);
  editableProduct.value = null;
}

function editWarehouse(product: MarkingProductRow) {
  editableProduct.value = product;
}

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys as EntityID[];
};

function onMultipleChange(warehousePlace: LabelInValueType) {
  const productsToChange = state.selectedRowKeys.map((key) => {
    return {
      productId: key,
      warehousePlaceId: warehousePlace.value as number,
    };
  });

  state.selectedRowKeys = [];
  editableProduct.value = null;
  state.isMultipleChangeModalVisible = false;

  onChangeProduct(productsToChange);
}

function showMultipleChangeModal() {
  state.isMultipleChangeModalVisible = true;
}

function deleteWarehouse(product: MarkingProductRow) {
  onChangeProduct([
    {
      productId: product.id,
      warehousePlaceId: null,
    },
  ]);
  editableProduct.value = null;
}

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

function fetchProducts(id: UrlParam, params?: MarkingProductFilters) {
  Executor.run({
    request: MarkingRepository.fetchProducts(id, params),
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

function onSubmitMarking(values: UpdateMarkingDto) {
  Executor.run({
    request: MarkingRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
  });
}

function onChangeProduct(values: UpdateMarkingProductDto[]) {
  Executor.run({
    request: MarkingRepository.updateProducts(dataId.value, values),
    loadingState,
    messageType: MessageType.Updated,
    onComplete() {
      submitFilter();
    },
  });
}

function removeProducts(keys: EntityID[]) {
  Executor.run({
    request: MarkingRepository.deleteProducts(dataId.value, keys),
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
