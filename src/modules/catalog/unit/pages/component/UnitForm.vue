<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="unit_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem :label="$t('common.name')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>
    <AFormItem :label="$t('common.description')" name="alias">
      <AInput v-model:value="form.alias" />
    </AFormItem>
    <AFormItem
      :label="$t('common.unitType')"
      name="typeId"
    >
      <SelectUnitType v-model:value="form.typeId" :disabled="isEditing" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { UnitRepository } from '@/modules/catalog/unit/unit.repository';
import type { UpdateUnitDto } from '@/modules/catalog/unit/unit.dto';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  alias: vvRequired,
  typeId: vvRequired,
};

const { form } = useResettableState<UpdateUnitDto>(() => ({
  title: '',
  alias: '',
  typeId: undefined,
}));

const isEditing = computed(() => !!props.dataId);

onMounted(() => {
  if (isEditing.value)
    readUnit(props.dataId!);
});

function readUnit(id: UrlParam) {
  return Executor.run({
    request: UnitRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.typeId = data.type.id;
      form.alias = data.alias;
    },
  });
}

function onFinish(values: UpdateUnitDto) {
  if (isEditing.value)
    delete values.typeId;

  emit('submit', values);
}
</script>
