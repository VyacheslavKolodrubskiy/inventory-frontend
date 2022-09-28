<template>
  <BaseSelect
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.search')"
    @focus="onFocus"
    @search="onSearch"
    @select="onSelect"
  >
    <template #option="option">
      <SelectOption :description="option.region.title" :title="getHighlightedText(option)" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { useSearch } from '@/shared/composables/useSearch';
import { Executor } from '@/shared/network/executor';
import { CityRepository } from '@/modules/catalog/city/city.repository';
import type { City } from '@/modules/catalog/city/city.model';
import type { CityFilters } from '@/modules/catalog/city/city.dto';

const props = defineProps<{
  filters?: CityFilters
}>();

const emit = defineEmits(['select']);

function onSelect(val: any, option: City) {
  emit('select', val, option);
}

const {
  options,
  loadingState,
  getHighlightedText,
  onSearch,
  onFocus,
} = useSearch<City, CityFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: CityRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
