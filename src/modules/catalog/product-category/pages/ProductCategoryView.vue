<template>
  <QDrawer :title="$t('product-category.view')">
    <template #extra>
      <EditLink :to="{ name: 'CatalogProductCategory.Edit' }" />
    </template>
    <ASkeleton v-if="loadingState.isLoading.value" active />

    <ADescriptions
      v-else-if="product"
      bordered
      layout="vertical"
    >
      <ADescriptionsItem :label="$t('common.name')">
        {{ product.title }}
      </ADescriptionsItem>
    </ADescriptions>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import { Executor } from '@/shared/network/executor';
import type { ProductCategory } from '@/modules/catalog/product-category/product-category.model';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';
import { useLoading } from '@/shared/composables/useLoading';

const route = useRoute();

const dataId = computed(() => route.params.productCategoryId as string);

const product = ref<Nullable<ProductCategory>>(null);
const loadingState = useLoading();

onMounted(() => {
  readProductCategory(dataId.value);
});

function readProductCategory(dataId: UrlParam) {
  return Executor.run({
    request: ProductCategoryRepository.read(dataId),
    loadingState,
    onResult(data) {
      product.value = data;
    },
  });
}
</script>
