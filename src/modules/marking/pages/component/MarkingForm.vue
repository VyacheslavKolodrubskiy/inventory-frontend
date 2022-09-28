<template>
  <AForm
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

      <ACol :xs="24">
        <SubmitButton />
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateMarkingDto } from '../../marking.dto';
import { MarkingRepository } from '../../marking.repository';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit', 'updateMarking']);

const formRules = {
  title: vvRequired,
  description: vvRequired,
  responsibleUserId: vvRequired,
};

const { form } = useResettableState<UpdateMarkingDto>(() => ({
  title: '',
  responsibleUserId: null,
}));

function readMarking(id: UrlParam) {
  return Executor.run({
    request: MarkingRepository.read(id),
    onResult(data) {
      form.title = data.title;
      form.responsibleUserId = createLabelInValue(data.responsibleEmployee.name, data.responsibleEmployee.id);
      emit('updateMarking', data);
    },
  });
}

function onFinish(values: UpdateMarkingDto) {
  values.responsibleUserId = getLabelInValueId(values.responsibleUserId);
  emit('submit', values);
}

onMounted(() => {
  readMarking(props.dataId!);
});
</script>
