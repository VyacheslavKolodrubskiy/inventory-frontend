<template>
  <AModal
    centered
    :title="$t('common.warehousePlaceGroupAppointment')"
    width="400px"
    @cancel="onCancel"
    @ok="onOk"
  >
    <ATypographyParagraph>{{ $t('message.selectWarehousePlace') }}</ATypographyParagraph>

    <SelectWarehousePlace
      v-model:value="warehousePlaceSelected"
      :filters="{ warehouseId }"
      label-in-value
    />
  </AModal>
</template>

<script lang="ts" setup>
import type { LabelInValueType } from 'ant-design-vue/es/vc-select/Select';

defineProps<{
  warehouseId?: number | null
}>();

const emit = defineEmits(['submit']);
const warehousePlaceSelected = ref<null | LabelInValueType>(null);

function onCancel() {
  warehousePlaceSelected.value = null;
}
function onOk() {
  emit('submit', warehousePlaceSelected.value
    ? { label: warehousePlaceSelected.value.label, value: warehousePlaceSelected.value.value }
    : null);
  warehousePlaceSelected.value = null;
}
</script>
