<template>
  <ADatePicker
    :format="_format"
    :picker="picker"
    :show-time="showTime"
    :value="dateValue"
    :value-format="_valueFormat"
    @update:value="onUpdateValue"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </ADatePicker>
</template>

<script setup lang="ts">
import { capitalize } from '@qlt2020/frutils';
import type { Nullable } from '@qlt2020/frutils';
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';
import type { Dayjs } from 'dayjs';
import { DatePickerFormat, DatePickerValueFormat } from '@/shared/config/constants';

type DateValue = Nullable<string | Dayjs>;
const props = withDefaults(defineProps<{
  value?: DateValue
  picker?: PickerMode
  format?: string
  valueFormat?: string
  showTime?: boolean | Record<string, any>
}>(), {
  value: undefined,
  format: undefined,
  valueFormat: undefined,
  picker: 'date',
  showTime: false,
});

const emit = defineEmits(['update:value']);

const _format = computed(() => {
  if (props.format)
    return props.format;

  if (props.picker === 'date')
    return props.showTime ? `${DatePickerFormat.Date} HH:mm` : DatePickerFormat.Date;

  return DatePickerFormat[capitalize(props.picker) as Capitalize<Exclude<PickerMode, 'date'>>];
});

const _valueFormat = computed(() => {
  if (props.valueFormat)
    return props.valueFormat;

  if (props.picker === 'date')
    return props.showTime ? DatePickerValueFormat.DateTime : DatePickerValueFormat.Date;

  // TODO handle all picker mode formats
  return DatePickerValueFormat.Date;
});

// Give the type (undefined) that wants AntD component
const dateValue = computed(() => props.value || undefined);

// Emit the type that we want work with (null)
function onUpdateValue(date: DateValue) {
  emit('update:value', date || null);
}
</script>
