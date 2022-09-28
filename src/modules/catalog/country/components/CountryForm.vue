<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="country_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem :label="$t('common.country')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>
    <AFormItem :label="$t('country.slug')" name="slug">
      <AInput v-model:value="form.slug" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { CountryRepository } from '@/modules/catalog/country/country.repository';
import type { UpdateCountryDto } from '@/modules/catalog/country/country.dto';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  slug: vvRequired,
};

const { form } = useResettableState<UpdateCountryDto>(() => ({
  title: '',
  slug: '',
}));

const isEditing = computed(() => !!props.dataId);

onMounted(() => {
  if (isEditing.value)
    readCountry(props.dataId!);
});

function readCountry(id: UrlParam) {
  return Executor.run({
    request: CountryRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.slug = data.slug;
    },
  });
}

function onFinish(values: UpdateCountryDto) {
  emit('submit', values);
}
</script>
