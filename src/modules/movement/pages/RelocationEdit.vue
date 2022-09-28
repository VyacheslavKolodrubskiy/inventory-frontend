<template>
  <div>
    <QPageHeader>
      <template #title>
        <DocumentTitle
          v-if="relocationData"
          :id="relocationData.id"
          :title="relocationData.title"
          type="relocation"
        />
      </template>

      <ASpace>
        <span>
          <ATypographyText type="secondary">
            {{ $t('common.fromWarehouse') }}
          </ATypographyText>
          {{ relocationData?.fromWarehouse.title }}
        </span>

        <ArrowRightOutlined />

        <span>
          <ATypographyText type="secondary">
            {{ $t('common.toWarehouse') }}
          </ATypographyText>
          {{ relocationData?.toWarehouse.title }}
        </span>
      </ASpace>
    </QPageHeader>

    <ACard>
      <RelocationForm
        :data-id="dataId"
        :to-warehouse-id="relocationData?.toWarehouse.id"
        @submit="onSubmitRelocation"
        @update-relocation="onUpdateRelocation"
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
            <SearchProductCategory
              v-model:value="filters.productCategoryId"
              allow-clear
              :placeholder="$t('common.searchBy.category')"
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
import { RelocationRepository } from '../relocation.repository';
import type { RelocationProductFilters, RemoveRelocationProductDto, UpdateRelocationDto } from '../relocation.dto';
import type { Relocation } from '@/modules/movement/relocation.model';
import { DocumentStatus } from '@/shared/enums/status.enum';
import type { EntityID } from '@/types';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { useResettableState } from '@/shared/composables/useResettableState';
import type { MovementProduct } from '@/shared/models/registry-product.model';
import RelocationForm from '@/modules/movement/pages/component/RelocationForm.vue';
import { useUserStore } from '@/shared/store/user.store';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();

const dataId = computed(() => route.params.relocationId as string);
const relocationData = ref<Nullable<Relocation>>(null);
const warehouseId = computed(() => relocationData.value?.toWarehouse.id);

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  markId: undefined,
}));

const state = reactive({
  products: [] as MovementProduct[],
  selectedRowKeys: [] as EntityID[],
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
    dataIndex: 'action',
    width: 50,
  },
];

function onUpdateRelocation(relocation: Relocation) {
  if (relocation.status.id !== DocumentStatus.Created.id || userStore.current.id !== relocation.author.id)
    router.replace({ name: 'Movement.Main' });

  relocationData.value = relocation;
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

function fetchProducts(id: UrlParam, params?: RelocationProductFilters) {
  Executor.run({
    request: RelocationRepository.fetchProducts(id, params),
    pagination,
    loadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}

function onSubmitRelocation(values: UpdateRelocationDto) {
  Executor.run({
    request: RelocationRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
  });
}

function removeProducts(keys: RemoveRelocationProductDto) {
  Executor.run({
    request: RelocationRepository.deleteProducts(dataId.value, keys),
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
