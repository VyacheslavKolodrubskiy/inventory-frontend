<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="warehouse_place_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="24">
      <ACol
        :xs="24"
      >
        <AFormItem :label="$t('common.name')" name="title">
          <AInput v-model:value="form.title" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem :label="$t('common.description')" name="description">
          <AInput v-model:value="form.description" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem :label="$t('common.warehouses')" name="warehouseId">
          <SelectWarehouse v-model:value="form.warehouseId" :disabled="isEditing" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateWarehousePlaceDto } from '../warehouse-place.dto';
import { WarehousePlaceRepository } from '../warehouse-place.repository';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { useResettableState } from '@/shared/composables/useResettableState';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  warehouseId: vvRequired,
};

const isEditing = computed(() => !!props.dataId);

const { form } = useResettableState<UpdateWarehousePlaceDto>(() => ({
  title: '',
  description: '',
  warehouseId: null,
}));

onMounted(() => {
  if (isEditing.value)
    readWarehousePlace(props.dataId as UrlParam);
});

function readWarehousePlace(id: UrlParam) {
  return Executor.run({
    request: WarehousePlaceRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.description = data.description;
      if (data.warehouse)
        form.warehouseId = createLabelInValue(data.warehouse.title, data.warehouse.id);
    },
  });
}

function onFinish(values: UpdateWarehousePlaceDto) {
  values.warehouseId = getLabelInValueId(values.warehouseId);
  emit('submit', values);
}
</script>
