<template>
  <BaseSelect
    :filter-option="filterOption"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.unitShort')"
    @focus="onFocus"
    @search="onSearch"
  >
    <template #option="option">
      <SelectOption :description="$t(option.type.title)" :title="`${option.alias} (${getHighlightedText(option)})`" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { useSelect } from '@/shared/composables/useSelect';
import { Executor } from '@/shared/network/executor';
import { UnitRepository } from '@/modules/catalog/unit/unit.repository';
import type { Unit } from '@/shared/models/unit.model';
import type { UnitFilters } from '@/modules/catalog/unit/unit.dto';

const props = defineProps<{
  filters?: Partial<UnitFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  filterOption,
  onSearch,
  onFocus,
} = useSelect<Unit, UnitFilters>(props, {
  fetchOptions(params) {
    Executor.run({
      request: UnitRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
