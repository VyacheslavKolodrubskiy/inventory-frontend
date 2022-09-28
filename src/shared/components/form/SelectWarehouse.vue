<template>
  <BaseSelect
    :filter-option="filterOption"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.warehouse')"
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
import { WarehouseRepository } from '@/modules/counterparty/warehouse/warehouse.repository';
import type { WarehouseFilters } from '@/modules/counterparty/warehouse/warehouse.dto';
import type { Warehouse } from '@/modules/counterparty/warehouse/warehouse.model';

const props = defineProps<{
  filters?: Partial<WarehouseFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  filterOption,
  onSearch,
  onFocus,
} = useSelect<Warehouse, WarehouseFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: WarehouseRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
