<template>
  <BaseSelect
    label-field="name"
    :loading="loadingState.isLoading.value"
    :options="options"
    :placeholder="$t('common.search')"
    @focus="onFocus"
    @search="onSearch"
  >
    <template #option="option">
      <SelectOption :title="getHighlightedText(option)" />
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import { isArray } from '@qlt2020/frutils';
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import type { ManagerFilters } from '@/modules/user/manager/manager.dto';
import type { Manager } from '@/modules/user/manager/manager.model';
import { ManagerRepository } from '@/modules/user/manager/manager.repository';
import { useSearch } from '@/shared/composables/useSearch';
import { Executor } from '@/shared/network/executor';

const props = defineProps<{
  filters?: Partial<ManagerFilters>
}>();

const {
  options,
  loadingState,
  getHighlightedText,
  onSearch,
  onFocus,
} = useSearch<Manager, ManagerFilters>(props, {
  label: 'name',
  fetchOptions(params) {
    Executor.run({
      request: ManagerRepository.fetch(params),
      loadingState,
      onResult(data) {
        options.value = data.list;
      },
    });
  },
});
</script>
