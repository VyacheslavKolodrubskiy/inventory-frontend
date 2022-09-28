<template>
  <ASelect
    :allow-clear="allowClear"
    :field-names="{ label: labelField, value: valueField }"
    :filter-option="filterOption"
    :not-found-content="null"
    show-search
  >
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </ASelect>
</template>

<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';

const props = withDefaults(defineProps<{
  allowClear?: boolean
  labelField?: string
  valueField?: string
  filterOption?: SelectProps['filterOption']
}>(), {
  allowClear: true,
  labelField: 'title',
  valueField: 'id',
  filterOption: false,
});
</script>
