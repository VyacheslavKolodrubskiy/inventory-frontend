<template>
  <BaseSelect
    :filter-option="filterOption"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.country')"
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
import { useSelect } from '@/shared/composables/useSelect';
import { Executor } from '@/shared/network/executor';
import { CountryRepository } from '@/modules/catalog/country/country.repository';
import type { Country } from '@/shared/models/country.model';
import type { CountryFilters } from '@/modules/catalog/country/country.dto';

const props = defineProps<{
  filters?: Partial<CountryFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  filterOption,
  onSearch,
  onFocus,
} = useSelect<Country, CountryFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: CountryRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
