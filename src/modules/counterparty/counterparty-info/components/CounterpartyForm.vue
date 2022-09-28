<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    id="counterparty_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="24">
      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.name')" name="title">
          <AInput v-model:value="form.title" />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.alias')" name="alias">
          <AInput v-model:value="form.alias" />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.abbr.iinBin')" name="bin">
          <AInput
            v-model:value="form.bin"
            v-maska="'############'"
            :disabled="isEditing"
          />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.city')" name="cityId">
          <SearchCity v-model:value="form.cityId" />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.address')" name="address">
          <AInput v-model:value="form.address" />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem label="Email" name="email">
          <AInput v-model:value="form.email" />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.phone')" name="phone">
          <AInput
            v-model:value="form.phone"
            v-maska="'+7 (###) ### ## ##'"
            @maska="formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>

      <ACol
        :md="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.logo')" name="logo">
          <AInput v-model:value="form.logo" />
        </AFormItem>
      </ACol>
    </arow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateCounterpartyInfoDto } from '@/modules/counterparty/counterparty-info/counterparty-info.dto';
import { CounterpartyInfoRepository } from '@/modules/counterparty/counterparty-info/counterparty-info.repository';
import { vvBinIin, vvEmail, vvLatin, vvPhone, vvRequired } from '@/shared/config/validation-rules';
import { Executor, LoadingType } from '@/shared/network/executor';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();
const emit = defineEmits(['submit']);
const formattedPhone = ref<string>('');
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  bin: [vvRequired, vvBinIin],
  address: vvRequired,
  alias: [vvRequired, vvLatin],
  email: [vvEmail, vvRequired],
  phone: [vvPhone],
  cityId: [vvRequired],
};

const isEditing = computed(() => !!props.dataId);

const form: UpdateCounterpartyInfoDto = reactive({
  title: '',
  bin: '',
  address: '',
  email: '',
  phone: '',
  alias: '',
  logo: '',
  cityId: null,
});

onMounted(() => {
  if (isEditing.value)
    readCounterparty(props.dataId as UrlParam);
});

function readCounterparty(id: UrlParam) {
  return Executor.run({
    request: CounterpartyInfoRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.bin = data.bin;
      form.address = data.address;
      form.email = data.email;
      form.phone = data.phone;
      form.alias = data.alias;
      form.logo = data.logo;
      form.cityId = createLabelInValue(data.city.title, data.city.id);
    },
  });
}

function onFinish(values: UpdateCounterpartyInfoDto) {
  if (formattedPhone.value)
    values.phone = `7${formattedPhone.value}`;

  values.cityId = getLabelInValueId(values.cityId);
  emit('submit', values);
}
</script>
