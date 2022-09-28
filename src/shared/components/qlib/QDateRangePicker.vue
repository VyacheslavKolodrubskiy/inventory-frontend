<template>
  <ARangePicker
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
  </ARangePicker>
</template>

<script setup lang="ts">
import { capitalize } from '@qlt2020/frutils';
import type { Nullable, Recordable } from '@qlt2020/frutils';
import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';
import type { Dayjs } from 'dayjs';
import { DatePickerFormat, DatePickerValueFormat } from '@/shared/config/constants';
import type { DateRange } from '@/types.js';

type OriginalDateValue = Nullable<[string, string] | [Dayjs, Dayjs]>;
type DateValue = Nullable<DateRange<string> | DateRange<Dayjs>>;

const props = withDefaults(defineProps<{
  value?: DateValue
  picker?: PickerMode
  format?: string
  valueFormat?: string
  showTime?: boolean | Recordable
  expandTime?: boolean
}>(), {
  value: undefined,
  format: undefined,
  valueFormat: undefined,
  picker: 'date',
  showTime: false,
  expandTime: false,
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

function convertToOriginal(value: DateValue) {
  if (!value)
    return null;

  return [value.from, value.to] as OriginalDateValue;
}

// Give the type (undefined) that wants AntD component
const dateValue = computed(() => convertToOriginal(props.value) || undefined);

// Emit the type that we want work with (null)
function onUpdateValue(date: OriginalDateValue) {
  if (date) {
    const value = { from: date[0], to: date[1] };
    if (props.picker === 'date' && !props.showTime && props.expandTime) {
      value.from = `${value.from}T00:00:00`;
      value.to = `${value.to}T23:59:59`;
    }

    emit('update:value', value);
  } else {
    emit('update:value', null);
  }
}
</script>
