<template>
  <QDrawer
    size="lg"
    :title="$t('inventory.view')"
  >
    <template v-if="inventory?.status.id === DocumentStatus.Created.id && inventory?.author.id === userStore.current.id && $canUse('Manager')" #extra>
      <EditLink :to="{ name: 'Inventory.Edit' }" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="inventory">
      <div v-if="inventory.status.id === DocumentStatus.Created.id && (inventory.responsibleEmployee.id === userStore.current.id || inventory.author.id === userStore.current.id)" class="mb-4">
        <ASpace>
          <APopconfirm
            :cancel-text="$t('common.no')"
            :ok-text="$t('common.yes')"
            :title="$t('message.confirmCloseDocument')"
            @confirm="close"
          >
            <AButton
              type="primary"
            >
              <CheckOutlined />
              {{ $t('action.complete') }}
            </AButton>
          </APopconfirm>
          <APopconfirm
            :cancel-text="$t('common.no')"
            :ok-text="$t('common.yes')"
            :title="$t('action.sendDocumentToDCT')"
            @confirm="sendToTerminal"
          >
            <AButton>
              <AndroidOutlined />
              {{ $t('action.sendToDCT') }}
            </AButton>
          </APopconfirm>
        </ASpace>
      </div>
      <ATypographyTitle :level="4">
        <DocumentTitle
          :id="inventory.id"
          :title="inventory.title"
          type="inventory"
        />
      </ATypographyTitle>
      <div>
        <ATag :color="inventory.status.color">
          {{ $t(inventory.status.title) }}
        </ATag>

        <DocumentCreationInfo :author="inventory.author.name" :date="inventory.createdDate" />
      </div>

      <ADescriptions
        class="mt-5"
        layout="horizontal"
        size="small"
      >
        <ADescriptionsItem :label="$t('common.warehouse')" :span="3">
          <RouterLink :to="{ name: 'Inventory.Warehouse.View', params: { warehouseId: inventory.warehouse.id } }">
            {{ inventory.warehouse.title }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.responsible')" :span="3">
          <RouterLink :to="{ name: 'Inventory.Manager.View', params: { managerId: inventory.responsibleEmployee.id } }">
            {{ inventory.responsibleEmployee.name }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.comment')" :span="3">
          {{ inventory.description }}
        </ADescriptionsItem>
      </ADescriptions>

      <ADivider class="mt-5" orientation="center">
        {{ $t('common.productList') }}
      </ADivider>

      <ARow class="items-center" :gutter="10">
        <ACol class="mr-auto">
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
                :placeholder="$t('common.searchBy.category')"
              />
            </AFormItem>

            <AFormItem :label="$t('common.status')">
              <SelectProductStatus v-model:value="filters.statusId" />
            </AFormItem>

            <AFormItem :label="$t('common.warehousePlace')">
              <SelectWarehousePlace
                v-model:value="filters.warehousePlaceId"
                :filters="{ warehouseId: inventory.warehouse.id }"
                :placeholder="$t('common.searchBy.place')"
              />
            </AFormItem>

            <AFormItem :label="$t('common.productMarked')">
              <YesNoRadio v-model:value="filters.markId" />
            </AFormItem>
          </AppFilter>
        </ACol>

        <ACol>
          <APopover placement="bottomRight">
            <template #content>
              <AList>
                <AListItem class="py-1">
                  {{ $t('common.created[0]') }}
                  <template #actions>
                    <span class="text-gray-500">{{ inventory.productStatus.created }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.confirmedWithTerminal') }}
                  <template #actions>
                    <span class="text-blue-500">{{ inventory.productStatus.confirmedWithTerminal }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.confirmedManually') }}
                  <template #actions>
                    <span class="text-cyan-500">{{ inventory.productStatus.confirmedManually }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.notConfirmed') }}
                  <template #actions>
                    <span class="text-orange-500">{{ inventory.productStatus.notConfirmed }}</span>
                  </template>
                </AListItem>
              </AList>
            </template>

            <ATypographyLink @click.prevent>
              <InfoCircleOutlined />
              {{ $t('common.productsTotal') }} {{ inventory.productStatus.total }}
            </ATypographyLink>
          </APopover>
        </ACol>
      </ARow>

      <QTable
        :columns="columns"
        :data-source="state.products"
        :loading="productloadingState.isLoading.value"
        :pagination="pagination"
        :scroll="undefined"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'title'">
            <RouterLink class="flex items-center" :to="{ name: 'Inventory.RegistryProduct.View', params: { productId: record.uuid } }">
              <MarkingStatus class="mr-2" :marked="record.isMarked" />
              <SingleDescription :description="record.category.title">
                {{ text }}
              </SingleDescription>
            </RouterLink>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <ATag :color="record.status.color">
              {{ $t(record.status.title) }}
            </ATag>
          </template>
        </template>
      </QTable>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { Inventory } from '../inventory.model';
import { InventoryRepository } from '../inventory.repository';
import type { InventoryProductFilters } from '../inventory.dto';
import type { InventoryProduct } from '@/shared/models/registry-product.model';
import { Executor, MessageType } from '@/shared/network/executor';
import { useLoading } from '@/shared/composables/useLoading';
import { useResettableState } from '@/shared/composables/useResettableState';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { DocumentStatus } from '@/shared/enums/status.enum';
import { useUserStore } from '@/shared/store/user.store';
import SelectProductStatus from '@/shared/components/form/SelectProductStatus.vue';

const userStore = useUserStore();
const { t } = useI18n();
const route = useRoute();
const loadingState = useLoading();
const productloadingState = useLoading();
const pagination = usePagination();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  statusId: null,
  warehousePlaceId: null,
  markId: undefined,
}));

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
    title: t('common.quantityShort'),
    dataIndex: 'amount',
    width: 100,
  },
  {
    title: t('common.warehousePlace'),
    dataIndex: ['warehousePlace', 'title'],
    ellipsis: true,
  },
];

const dataId = computed(() => route.params.inventoryId as string);

const inventory = ref<Nullable<Inventory>>(null);

const state = reactive({
  products: [] as InventoryProduct[],
});

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchProducts(dataId.value, {
    ...getPaginationParams(pagination),
    ...filters,
  });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchProducts(id: UrlParam, params?: InventoryProductFilters) {
  Executor.run({
    request: InventoryRepository.fetchProducts(id, params),
    pagination,
    loadingState: productloadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}

function readInventory(dataId: UrlParam) {
  Executor.run({
    request: InventoryRepository.read(dataId),
    loadingState,
    onResult(data) {
      inventory.value = data;
    },
  });
}

function close() {
  Executor.run({
    request: InventoryRepository.close(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readInventory(dataId.value);
      submitFilter();
    },
  });
}

function sendToTerminal() {
  Executor.run({
    request: InventoryRepository.sendToTerminal(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readInventory(dataId.value);
    },
  });
}

readInventory(dataId.value);
fetchProducts(dataId.value);
</script>
