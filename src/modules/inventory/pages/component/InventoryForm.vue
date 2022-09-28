<template>
  <AForm
    id="inventory_product_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="20">
      <ACol
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.name')" name="title">
          <AInput v-model:value="form.title" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.responsibleEmployee')" name="responsibleUserId">
          <SearchManager v-model:value="form.responsibleUserId" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.comment')" name="description">
          <AInput v-model:value="form.description" />
        </AFormItem>
      </ACol>

      <ACol :xs="24">
        <SubmitButton />
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { InventoryRepository } from '../../inventory.repository';
import type { UpdateInventoryDto } from '../../inventory.dto';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit', 'updateMovement']);

const formRules = {
  title: vvRequired,
  responsibleUserId: vvRequired,
};

const isEditing = computed(() => !!props.dataId);

const { form } = useResettableState<UpdateInventoryDto>(() => ({
  title: '',
  description: '',
  responsibleUserId: null,
}));

function readMovement(id: UrlParam) {
  return Executor.run({
    request: InventoryRepository.read(id),
    onResult(data) {
      form.title = data.title;
      form.description = data.description;
      form.responsibleUserId = createLabelInValue(data.responsibleEmployee.name, data.responsibleEmployee.id);
      emit('updateMovement', data);
    },
  });
}

function onFinish(values: UpdateInventoryDto) {
  values.responsibleUserId = getLabelInValueId(values.responsibleUserId);
  emit('submit', values);
}

onMounted(() => {
  if (isEditing.value)
    readMovement(props.dataId!);
});
</script>
