<template>
  <AForm
    id="movement_product_form"
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
        <AFormItem :label="$t('common.abbr.mol')" name="liabilityUserId">
          <SearchManager v-model:value="form.liabilityUserId" :filters="{ warehouseId: toWarehouseId }" />
        </AFormItem>
      </ACol>

      <ACol
        :lg="6"
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.comment')" name="comment">
          <AInput v-model:value="form.comment" />
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
import { RelocationRepository } from '../../relocation.repository';
import type { UpdateRelocationDto } from '../../relocation.dto';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import type { LabelInValueMixed } from '@/types';

const props = defineProps<{
  dataId?: string
  toWarehouseId: LabelInValueMixed
}>();

const emit = defineEmits(['submit', 'updateRelocation']);

const formRules = {
  title: vvRequired,
  responsibleUserId: vvRequired,
  liabilityUserId: vvRequired,
};

const isEditing = computed(() => !!props.dataId);

const { form } = useResettableState<UpdateRelocationDto>(() => ({
  title: '',
  comment: '',
  responsibleUserId: null,
  liabilityUserId: null,
}));

function readMovement(id: UrlParam) {
  return Executor.run({
    request: RelocationRepository.read(id),
    onResult(data) {
      form.title = data.title;
      form.comment = data.description;
      form.responsibleUserId = createLabelInValue(data.responsibleEmployee.name, data.responsibleEmployee.id);
      form.liabilityUserId = createLabelInValue(data.liabilityUser.name, data.liabilityUser.id);
      emit('updateRelocation', data);
    },
  });
}

function onFinish(values: UpdateRelocationDto) {
  values.responsibleUserId = getLabelInValueId(values.responsibleUserId);
  values.liabilityUserId = getLabelInValueId(values.liabilityUserId);
  emit('submit', values);
}

onMounted(() => {
  if (isEditing.value)
    readMovement(props.dataId!);
});
</script>
