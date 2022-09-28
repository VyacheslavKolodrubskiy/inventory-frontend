<template>
  <BaseSelect
    :filter-option="filterOption"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.counterparty')"
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
import { CounterpartyInfoRepository } from '@/modules/counterparty/counterparty-info/counterparty-info.repository';
import type { CounterpartyInfoFilters } from '@/modules/counterparty/counterparty-info/counterparty-info.dto';
import type { CounterpartyInfo } from '@/modules/counterparty/counterparty-info/counterparty-info.model';

const props = defineProps<{
  filters?: Partial<CounterpartyInfoFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  filterOption,
  onSearch,
  onFocus,
} = useSelect<CounterpartyInfo, CounterpartyInfoFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: CounterpartyInfoRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
