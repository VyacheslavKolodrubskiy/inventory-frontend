<template>
  <BaseSelect
    :filter-option="filterOption"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.warehousePlace')"
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
import {
  WarehousePlaceRepository,
} from '@/modules/counterparty/warehouse/warehouse-place.repository';
import type { WarehousePlace } from '@/modules/counterparty/warehouse/warehouse-place.model';
import type { WarehousePlaceFilters } from '@/modules/counterparty/warehouse/warehouse-place.dto';

const props = defineProps<{
  filters?: Partial<WarehousePlaceFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  filterOption,
  onSearch,
  onFocus,
} = useSelect<WarehousePlace, WarehousePlaceFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: WarehousePlaceRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
