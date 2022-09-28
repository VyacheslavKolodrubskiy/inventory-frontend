<template>
  <BaseSelect
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.search')"
    @focus="onFocus"
    @search="onSearch"
  >
    <template #option="option">
      <SelectOption :description="option.country.title" :title="getHighlightedText(option)" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { useSearch } from '@/shared/composables/useSearch';
import { Executor } from '@/shared/network/executor';
import { RegionRepository } from '@/modules/catalog/region/region.repository';
import type { Region } from '@/modules/catalog/region/region.model';
import type { RegionFilters } from '@/modules/catalog/region/region.dto';

const props = defineProps<{
  filters?: Partial<RegionFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  onSearch,
  onFocus,
} = useSearch<Region, RegionFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: RegionRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
