<template>
  <QDrawer
    size="lg"
    :title="$t('movement.view')"
  >
    <template v-if="marking?.status.id === DocumentStatus.Created.id && marking?.author.id === userStore.current.id && $canUse('Manager')" #extra>
      <EditLink :to="{ name: 'Marking.Edit' }" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="marking">
      <div v-if="marking.status.id === DocumentStatus.Created.id && (marking.responsibleEmployee.id === userStore.current.id || marking.author.id === userStore.current.id)" class="mb-4">
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
          :id="marking.id"
          :title="marking.title"
          type="marking"
        />
      </ATypographyTitle>
      <div>
        <ATag v-if="marking.status" :color="marking.status.color">
          {{ $t(marking.status.title) }}
        </ATag>

        <DocumentCreationInfo :author="marking.author.name" :date="marking.createdDate" />
      </div>

      <ADescriptions
        class="mt-5"
        layout="horizontal"
        size="small"
      >
        <ADescriptionsItem :label="$t('common.warehouse')" :span="3">
          <RouterLink :to="{ name: 'Marking.Warehouse.View', params: { warehouseId: marking.warehouse.id } }">
            {{ marking.warehouse.title }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.responsible')" :span="3">
          <RouterLink :to="{ name: 'Marking.Manager.View', params: { managerId: marking.responsibleEmployee.id } }">
            {{ marking.responsibleEmployee.name }}
          </RouterLink>
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
                allow-clear
                :placeholder="$t('common.searchBy.category')"
              />
            </AFormItem>

            <AFormItem :label="$t('common.status')">
              <SelectProductStatus v-model:value="filters.statusId" />
            </AFormItem>

            <AFormItem :label="$t('common.warehousePlace')">
              <SelectWarehousePlace
                v-model:value="filters.warehousePlaceId"
                :filters="{ warehouseId: marking.warehouse.id }"
              />
            </AFormItem>

            <AFormItem :label="$t('common.productMarked')">
              <YesNoRadio v-model:value="filters.markId" />
            </AFormItem>

            <AFormItem :label="$t('common.markable')">
              <YesNoRadio v-model:value="filters.markable" />
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
                    <span class="text-gray-500">{{ marking.productStatus.created }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.confirmedWithTerminal') }}
                  <template #actions>
                    <span class="text-blue-500">{{ marking.productStatus.confirmedWithTerminal }}</span>
                  </template>
                </AListItem>
                <AListItem class="py-1">
                  {{ $t('statuses.notConfirmed') }}
                  <template #actions>
                    <span class="text-orange-500">{{ marking.productStatus.notConfirmed }}</span>
                  </template>
                </AListItem>
              </AList>
            </template>

            <ATypographyLink @click.prevent>
              <InfoCircleOutlined />
              {{ $t('common.productsTotal') }} {{ marking.productStatus.total }}
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
            <RouterLink class="flex items-center" :to="{ name: 'Marking.RegistryProduct.View', params: { productId: record.uuid } }">
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
          <template v-else-if="column.dataIndex === 'markable'">
            {{ Format.yesno(record.markable) }}
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
import type { Marking } from '../marking.model';
import { MarkingRepository } from '../marking.repository';
import type { MarkingProductFilters } from '../marking.dto';
import { Format } from '@/shared/utils/format';
import { Executor, MessageType } from '@/shared/network/executor';
import { DocumentStatus } from '@/shared/enums/status.enum';
import QTable from '@/shared/components/qlib/QTable.vue';
import { useResettableState } from '@/shared/composables/useResettableState';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import SearchProductCategory from '@/shared/components/form/SearchProductCategory.vue';
import type { MarkingProduct } from '@/shared/models/registry-product.model';
import { useUserStore } from '@/shared/store/user.store';
import SelectProductStatus from '@/shared/components/form/SelectProductStatus.vue';

const userStore = useUserStore();
const route = useRoute();
const { t } = useI18n();
const pagination = usePagination();
const loadingState = useLoading();
const productloadingState = useLoading();

const dataId = computed(() => route.params.markingId as string);

const marking = ref<Nullable<Marking>>(null);

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  productTitle: '',
  productCategoryId: null,
  warehousePlaceId: null,
  statusId: null,
  markId: undefined,
  markable: undefined,
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
  },
  {
    title: t('common.quantityShort'),
    dataIndex: 'amount',
    width: 100,
  },
  {
    title: t('common.markable'),
    dataIndex: 'markable',
  },
  {
    title: t('common.warehousePlace'),
    dataIndex: ['warehousePlace', 'title'],
    ellipsis: true,
  },
];

const state = reactive({
  products: [] as MarkingProduct[],
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

function fetchProducts(id: UrlParam, params?: MarkingProductFilters) {
  Executor.run({
    request: MarkingRepository.fetchProducts(id, params),
    pagination,
    loadingState: productloadingState,
    onResult(data) {
      state.products = data.list;
    },
  });
}

onMounted(() => {
  readMarking(dataId.value);
  fetchProducts(dataId.value);
});

function readMarking(dataId: UrlParam) {
  return Executor.run({
    request: MarkingRepository.read(dataId),
    loadingState,
    onResult(data) {
      marking.value = data;
    },
  });
}

function close() {
  Executor.run({
    request: MarkingRepository.close(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readMarking(dataId.value);
      submitFilter();
    },
  });
}

function sendToTerminal() {
  Executor.run({
    request: MarkingRepository.sendToTerminal(dataId.value),
    messageType: MessageType.Done,
    loadingState,
    onResult() {
      readMarking(dataId.value);
    },
  });
}
</script>
