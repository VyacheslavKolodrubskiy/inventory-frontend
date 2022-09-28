<template>
  <QDrawer size="sm" :title="$t('product-category.edit')">
    <template #extra>
      <SubmitButton form="product_category_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ProductCategoryForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import ProductCategoryForm from './component/ProductCategoryForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateProductCategoryDto } from '@/modules/catalog/product-category/product-category.dto';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';

const route = useRoute();
const router = useRouter();

const dataId = computed(() => route.params.productCategoryId as string);

const onSubmitEdit = (values: UpdateProductCategoryDto) => {
  Executor.run({
    request: ProductCategoryRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'CatalogProductCategory.Main' });
    },
  });
};
</script>
