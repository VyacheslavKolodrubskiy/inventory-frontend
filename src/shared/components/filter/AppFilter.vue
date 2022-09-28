<template>
  <AInputGroup class="!flex w-75" compact>
    <AInput
      :placeholder="placeholder || $t('common.searchEverywhere')"
      :value="value"
      @change="$emit('change', $event)"
      @update:value="onInput"
    >
      <template #prefix>
        <ATypographyText type="secondary">
          <SearchOutlined />
        </ATypographyText>
      </template>
    </AInput>
    <APopover
      v-if="$slots.default"
      overlay-class-name="w-90"
      placement="bottom"
      trigger="click"
    >
      <template #content>
        <AForm
          class="ant-form--sm"
          layout="vertical"
          @reset="reset"
          @submit="submit"
        >
          <slot />

          <ASpace class="mt-4">
            <AButton html-type="submit" type="primary">
              {{ $t('action.apply') }}
            </AButton>
            <AButton html-type="reset">
              {{ $t('action.reset') }}
            </AButton>
          </ASpace>
        </AForm>
      </template>

      <ATooltip placement="top" :title="$t('common.extendedFilter')">
        <AButton :type="isFilterEmpty ? 'default' : 'primary'">
          <FilterOutlined v-if="isFilterEmpty" />
          <FilterFilled v-else />
        </AButton>
      </ATooltip>
    </APopover>
  </AInputGroup>
</template>

<script lang="ts" setup>
import { isEqual, klonaLite } from '@qlt2020/frutils';
import { useDebounceFn } from '@vueuse/core';
import { INPUT_DEBOUNCE_DELAY } from '@/shared/config/constants';

const props = withDefaults(defineProps<{
  value?: string
  placeholder?: string
  filters: Record<string, any>
}>(), {
  value: '',
  placeholder: '',
});

const emit = defineEmits(['update:value', 'change', 'submit', 'reset']);

const initialFiltersValue = klonaLite(props.filters);

const isFilterEmpty = ref(true);
const debouncedSubmit = useDebounceFn(submit, INPUT_DEBOUNCE_DELAY);

function submit() {
  isFilterEmpty.value = isEqual(initialFiltersValue, props.filters);
  emit('submit');
}

function reset() {
  isFilterEmpty.value = true;
  emit('reset');
}

function onInput(val: string) {
  emit('update:value', val);
  debouncedSubmit();
}
</script>
