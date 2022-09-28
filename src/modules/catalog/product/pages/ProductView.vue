<template>
  <QDrawer :title="$t('product.view')">
    <template #extra>
      <EditButton @click="goToModalEdit" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="product">
      <ATypographyTitle :level="4">
        {{ product.title }}
      </ATypographyTitle>

      <div v-if="product.description">
        <ATypographyParagraph>
          {{ product.description }}
        </ATypographyParagraph>
      </div>

      <QCarousel :images="product.images" />

      <ADivider>{{ $t('common.information') }}</ADivider>

      <ARow :gutter="[20, 20]">
        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <GoldOutlined v-if="product.unit.type.id === UnitType.Countable.id" />
                <ExperimentOutlined v-else />
              </template>
            </AAvatar>
            <SingleDescription :description="$t(product.unit.type.title)">
              {{ product.unit.alias }} ({{ product.unit.title }})
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
            <SingleDescription :description="$t('common.productCategory')">
              {{ product.category.title }}
            </SingleDescription>
          </div>
        </ACol>
        <ACol :md="12">
          <div class="flex items-center">
            <MarkableStatus class="mr-2" :markable="product.markable" />
            <SingleDescription :description="$t('common.markable')">
              {{ Format.yesno(product.markable) }}
            </SingleDescription>
          </div>
        </ACol>
        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-primary-50 text-primary-500 mr-2" shape="square">
              <template #icon>
                <CalendarOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.createdDate')">
              {{ Format.datetimeFull(product.createdDate) }}
            </SingleDescription>
          </div>
        </ACol>
        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-primary-50 text-primary-500 mr-2" shape="square">
              <template #icon>
                <NumberOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.vendorCode')">
              {{ product.articular }}
            </SingleDescription>
          </div>
        </ACol>
      </ARow>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import { UnitType } from '@/shared/enums/status.enum';
import type { Product } from '@/modules/catalog/product/product.model';
import { Executor } from '@/shared/network/executor';
import { Format } from '@/shared/utils/format';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import { useGo } from '@/shared/composables/usePage';
import { useLoading } from '@/shared/composables/useLoading';
import QCarousel from '@/shared/components/qlib/QCarousel.vue';

const route = useRoute();

const dataId = computed(() => route.params.productId as string);
const loadingState = useLoading();

const product = ref<Nullable<Product>>(null);
const { goToModalEdit } = useGo();

onMounted(() => {
  readProduct(dataId.value);
});

function readProduct(dataId: UrlParam) {
  return Executor.run({
    request: ProductRepository.read(dataId),
    loadingState,
    onResult(data) {
      product.value = data;
    },
  });
}
</script>
