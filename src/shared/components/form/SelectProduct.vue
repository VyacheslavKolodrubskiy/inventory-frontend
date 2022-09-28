<template>
  <BaseSelect
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.search')"
    @focus="onFocus"
    @search="onSearch"
  >
    <template #option="option">
      <SelectOption :description="option.category.title" :title="getHighlightedText(option)" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import BaseSelect from '@/shared/components/form/BaseSelect.vue';

import type { ProductFilters } from '@/modules/catalog/product/product.dto';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import type { Product } from '@/modules/catalog/product/product.model';
import { useSearch } from '@/shared/composables/useSearch';
import { Executor } from '@/shared/network/executor';

const props = defineProps<{
  filters?: Partial<ProductFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  onSearch,
  onFocus,
} = useSearch<Product, ProductFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: ProductRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
