<template>
  <QDrawer
    size="lg"
    :title="$t('movement.view')"
  >
    <template v-if="movement?.status.id === DocumentStatus.Created.id && movement?.author.id === userStore.current.id && $canUse('Manager')" #extra>
      <EditLink :to="{ name: 'Movement.Relocation.Edit' }" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="movement">
      <div v-if="movement.status.id === DocumentStatus.Created.id && (movement.responsibleEmployee.id === userStore.current.id || movement.author.id === userStore.current.id)" class="mb-4">
        <ASpace>
          <APopconfirm
            :cancel-text="$t('common.no')"
            :ok-text="$t('common.yes')"
            :title="$t('message.confirmCloseDocument')"
            @confirm="close"
          >
            <AButton type="primary">
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
          :id="movement.id"
          :title="movement.title"
          type="relocation"
        />
      </ATypographyTitle>
      <div>
        <ATag :color="movement.status.color">
          {{ $t(movement.status.title) }}
        </ATag>

        <DocumentCreationInfo :author="movement.author.name" :date="movement.createdDate" />
      </div>

      <ADescriptions
        class="mt-5"
        :column="4"
        layout="horizontal"
        size="small"
      >
        <ADescriptionsItem :label="$t('common.fromWarehouse')" :span="2">
          <RouterLink :to="{ name: 'Movement.Warehouse.View', params: { warehouseId: movement.fromWarehouse.id } }">
            {{ movement.fromWarehouse.title }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.toWarehouse')" :span="2">
          <RouterLink :to="{ name: 'Movement.Warehouse.View', params: { warehouseId: movement.toWarehouse.id } }">
            {{ movement.toWarehouse.title }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.responsible')" :span="2">
          <RouterLink :to="{ name: 'Movement.Manager.View', params: { managerId: movement.responsibleEmployee.id } }">
            {{ movement.responsibleEmployee.name }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.abbr.mol')" :span="2">
          <RouterLink :to="{ name: 'Movement.Manager.View', params: { managerId: movement.liabilityUser.id } }">
            {{ movement.liabilityUser.name }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.comment')" :span="2">
          {{ movement.description }}
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
              />
            </AFormItem>

            <AFormItem :label="$t('common.productStatus')">
              <SelectProductStatus
                v-model:value="filters.statusId"
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
                    <span class="text-gray-500">{{ movement.productStatus.created }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.confirmedWithTerminal') }}
                  <template #actions>
                    <span class="text-blue-500">{{ movement.productStatus.confirmedWithTerminal }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.confirmedManually') }}
                  <template #actions>
                    <span class="text-cyan-500">{{ movement.productStatus.confirmedManually }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.notConfirmed') }}
                  <template #actions>
                    <span class="text-orange-500">{{ movement.productStatus.notConfirmed }}</span>
                  </template>
                </AListItem>
              </AList>
            </template>

            <ATypographyLink @click.prevent>
              <InfoCircleOutlined />
              {{ $t('common.productsTotal') }} {{ movement.productStatus.total }}
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
            <RouterLink class="flex items-center" :to="{ name: 'Movement.RegistryProduct.View', params: { productId: record.uuid } }">
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
          <template v-else-if="column.dataIndex === 'amount'">
            <SingleDescription :description="record.unit.title">
              {{ text }}
            </SingleDescription>
          </template>
        </template>
      </QTable>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { MovementProduct } from '@/shared/models/registry-product.model';
import { Executor, MessageType } from '@/shared/network/executor';
import { RelocationRepository } from '@/modules/movement/relocation.repository';
import type { RelocationProductFilters } from '@/modules/movement/relocation.dto';
import QTable from '@/shared/components/qlib/QTable.vue';
import { useResettableState } from '@/shared/composables/useResettableState';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { DocumentStatus } from '@/shared/enums/status.enum';
import type { Relocation } from '@/modules/movement/relocation.model';
import { useUserStore } from '@/shared/store/user.store';
import SelectProductStatus from '@/shared/components/form/SelectProductStatus.vue';

const userStore = useUserStore();
const route = useRoute();
const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();
const productloadingState = useLoading();

const dataId = computed(() => route.params.relocationId as string);

const movement = ref<Nullable<Relocation>>(null);

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  statusId: null,
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
    title: t('common.amount'),
    dataIndex: 'amount',
    ellipsis: true,
  },
];

const state = reactive({
  products: [] as MovementProduct[],
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

function fetchProducts(id: UrlParam, params?: RelocationProductFilters) {
  Executor.run({
    request: RelocationRepository.fetchProducts(id, params),
    pagination,
    loadingState: productloadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}

onMounted(() => {
  readRelocation(dataId.value);
  fetchProducts(dataId.value);
});

function readRelocation(dataId: UrlParam) {
  return Executor.run({
    request: RelocationRepository.read(dataId),
    loadingState,
    onResult(data) {
      movement.value = data;
    },
  });
}

function close() {
  Executor.run({
    request: RelocationRepository.close(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readRelocation(dataId.value);
      submitFilter();
    },
  });
}

function sendToTerminal() {
  Executor.run({
    request: RelocationRepository.sendToTerminal(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readRelocation(dataId.value);
    },
  });
}
</script>
