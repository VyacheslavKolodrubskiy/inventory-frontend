<template>
  <BaseSelect
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.searchBy.category')"
    @focus="onFocus"
    @search="onSearch"
  >
    <template #option="option">
      <span v-html="getHighlightedText(option)" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { useSearch } from '@/shared/composables/useSearch';
import { Executor } from '@/shared/network/executor';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';
import type { ProductCategory } from '@/modules/catalog/product-category/product-category.model';
import type { ProductCategoryFilters } from '@/modules/catalog/product-category/product-category.dto';

const props = defineProps<{
  filters?: Partial<ProductCategoryFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  onSearch,
  onFocus,
} = useSearch<ProductCategory, ProductCategoryFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: ProductCategoryRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
