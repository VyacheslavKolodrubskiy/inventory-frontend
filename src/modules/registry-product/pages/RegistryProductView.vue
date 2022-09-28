<template>
  <QDrawer
    :title="$t('product.viewWarehouse')"
  >
    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="product">
      <ARow>
        <ACol>
          <ATypographyTitle :level="4">
            <MarkingStatus class="mr-2" :marked="product.isMarked" />
            {{ product.title }}
          </ATypographyTitle>

          <ADescriptions
            class="mt-5"
            layout="horizontal"
            size="small"
          >
            <ADescriptionsItem label="TID" :span="3">
              <ATypographyText type="secondary">
                {{ product.tid }}
              </ATypographyText>
            </ADescriptionsItem>
            <ADescriptionsItem label="Barcode" :span="3">
              <ATypographyText type="secondary">
                {{ product.barcode }}
              </ATypographyText>
            </ADescriptionsItem>
          </ADescriptions>

          <ATypographyParagraph>
            {{ product.description }}
          </ATypographyParagraph>
        </ACol>
      </ARow>
      <QCarousel :images="product.images" />
      <ADivider>{{ $t('common.information') }}</ADivider>

      <ARow :gutter="[20, 20]">
        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <GoldOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t(product.unit.type.title)">
              {{ product.amount }} {{ product.unit.title }}
            </SingleDescription>
          </div>
        </ACol>

        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <TagsOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.category')">
              {{ product.category.title }}
            </SingleDescription>
          </div>
        </ACol>

        <ACol :md="12">
          <ATooltip placement="topLeft" :title="$t('common.warehouse')">
            <RouterLink class="flex items-center" :to="{ name: 'RegistryProduct.Warehouse.View', params: { warehouseId: product.receiveData.toWarehouse.id } }">
              <AAvatar class="bg-success-50 text-success-500 mr-2" shape="square">
                <template #icon>
                  <HomeOutlined />
                </template>
              </AAvatar>
              <SingleDescription :description="product.warehousePlace?.title">
                {{ product.warehouse.title }}
              </SingleDescription>
            </RouterLink>
          </ATooltip>
        </ACol>

        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-success-50 text-success-500 mr-2" shape="square">
              <template #icon>
                <DownloadOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.received')">
              {{ Format.datetimeFull(product.receiveData.createdDate) }}
            </SingleDescription>
          </div>
        </ACol>

        <ACol v-if="product.liabilityUser" :md="12">
          <RouterLink class="flex items-center" :to="{ name: 'RegistryProduct.Manager.View', params: { managerId: product.receiveData.responsibleEmployee.id } }">
            <AAvatar class="bg-primary-50 text-primary-500 mr-2" shape="square">
              <template #icon>
                <UserOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.abbr.mol')">
              <!-- TODO this field is temporarily optional, set it to required when possible -->
              {{ product.liabilityUser.name }}
            </SingleDescription>
          </RouterLink>
        </ACol>

        <ACol :md="12">
          <div class="flex items-center">
            <MarkableStatus class="mr-2" :markable="product.markable" />
            <SingleDescription :description="$t('common.markable')">
              {{ Format.yesno(product.markable) }}
            </SingleDescription>
          </div>
        </ACol>
      </ARow>

      <ADivider>{{ $t('common.receiving') }}</ADivider>

      <ATypographyTitle :level="5">
        <DocumentTitle
          :id="product.receiveData.id"
          :title="product.receiveData.title"
          type="receive"
        />
      </ATypographyTitle>

      <DocumentCreationInfo :author="product.receiveData.author.name" :date="product.receiveData.createdDate" />

      <ADescriptions
        class="mt-5"
        layout="horizontal"
        size="small"
      >
        <ADescriptionsItem :label="$t('common.toWarehouse')" :span="3">
          <RouterLink :to="{ name: 'RegistryProduct.Warehouse.View', params: { warehouseId: product.receiveData.toWarehouse.id } }">
            {{ product.receiveData.toWarehouse.title }}
          </RouterLink>
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.responsible')" :span="3">
          <RouterLink :to="{ name: 'RegistryProduct.Manager.View', params: { managerId: product.receiveData.responsibleEmployee.id } }">
            {{ product.receiveData.responsibleEmployee.name }}
          </RouterLink>
        </ADescriptionsItem>
      </ADescriptions>

      <ADivider v-if="productHistory?.length">
        {{ $t('common.history') }}
      </ADivider>

      <ATimeline>
        <ATimelineItem
          v-for="movement in productHistory"
          :key="movement.id"
          :color="movement.type.color"
        >
          <SingleDescription :description="Format.datetimeFull(movement.createdDate)">
            <RouterLink :to="getRouteThePage(movement, 'View')">
              <DocumentTitle
                :id="movement.id"
                :title="movement.title"
                :type="getMovementType(movement.type.id)"
              />
              <template v-if="movement.toWarehouse">
                {{ $t('common.toWarehouse').toLocaleLowerCase() }} {{ movement.toWarehouse.title }}
              </template>
            </RouterLink>
          </SingleDescription>
        </ATimelineItem>
      </ATimeline>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { RegistryProduct } from '@/shared/models/registry-product.model';
import { Executor } from '@/shared/network/executor';
import { RegistryProductRepository } from '@/shared/repository/registry-product.repository';
import { Format } from '@/shared/utils/format';
import { getRouteThePage } from '@/shared/utils/utils';
import { DocumentType } from '@/shared/enums/common.enum';
import type { Movement } from '@/modules/movement/movement.model.js';
import { useLoading } from '@/shared/composables/useLoading';
import QCarousel from '@/shared/components/qlib/QCarousel.vue';

const route = useRoute();
const loadingState = useLoading();

const dataId = computed(() => route.params.productId as string);

const product = ref<Nullable<RegistryProduct>>(null);

const productHistory = ref<Nullable<Movement[]>>(null);

function readProductHistory(uuid: UrlParam) {
  Executor.run({
    request: RegistryProductRepository.readProductHistory(uuid),
    onResult(data) {
      productHistory.value = data;
    },
  });
}

function getMovementType(id: number) {
  for (const [key, value] of Object.entries(DocumentType)) {
    if (value.movementTypeId === id)
      return key;
  }
}

function readProduct(id: UrlParam) {
  Executor.run({
    request: RegistryProductRepository.read(id),
    loadingState,
    onResult(data) {
      product.value = data;
    },
  });
}

onMounted(() => {
  readProductHistory(dataId.value);
  readProduct(dataId.value);
});
</script>
