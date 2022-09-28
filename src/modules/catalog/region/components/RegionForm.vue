<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="region_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem :label="$t('common.region')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>
    <AFormItem :label="$t('common.country')" name="countryId">
      <SelectCountry v-model:value="form.countryId" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { RegionRepository } from '@/modules/catalog/region/region.repository';
import type { UpdateRegionDto } from '@/modules/catalog/region/region.dto';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  countryId: vvRequired,
};

const form: UpdateRegionDto = reactive({
  title: '',
  countryId: null,
});

const isEditing = computed(() => !!props.dataId);

onMounted(() => {
  if (isEditing.value)
    readRegion(props.dataId!);
});

function readRegion(id: UrlParam) {
  return Executor.run({
    request: RegionRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.countryId = createLabelInValue(data.country.title, data.country.id);
    },
  });
}

function onFinish(values: UpdateRegionDto) {
  values.countryId = getLabelInValueId(values.countryId);
  emit('submit', values);
}
</script>
