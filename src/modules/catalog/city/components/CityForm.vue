<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="city_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem :label="$t('common.city')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>

    <AFormItem :label="$t('city.slug')" name="slug">
      <AInput v-model:value="form.slug" />
    </AFormItem>

    <AFormItem :label="$t('common.region')" name="regionId">
      <SearchRegion v-model:value="form.regionId" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { CityRepository } from '@/modules/catalog/city/city.repository';
import type { UpdateCityDto } from '@/modules/catalog/city/city.dto';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  regionId: vvRequired,
  slug: vvRequired,
};

const form: UpdateCityDto = reactive({
  title: '',
  regionId: null,
  slug: '',
});

const isEditing = computed(() => !!props.dataId);

onMounted(() => {
  if (isEditing.value)
    readCity(props.dataId!);
});

function readCity(id: UrlParam) {
  return Executor.run({
    request: CityRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.regionId = createLabelInValue(data.region.title, data.region.id);
      form.slug = data.slug;
    },
  });
}

function onFinish(values: UpdateCityDto) {
  values.regionId = getLabelInValueId(values.regionId);
  emit('submit', values);
}
</script>
