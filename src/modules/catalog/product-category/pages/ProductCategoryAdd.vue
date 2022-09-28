<template>
  <QDrawer size="sm" :title="$t('product-category.add')">
    <template #extra>
      <SubmitButton form="product_category_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ProductCategoryForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import ProductCategoryForm from './component/ProductCategoryForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateProductCategoryDto } from '@/modules/catalog/product-category/product-category.dto';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';
const router = useRouter();

function onSubmitAdd(values: UpdateProductCategoryDto) {
  Executor.run({
    request: ProductCategoryRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'CatalogProductCategory.Main' });
    },
  });
}
</script>
