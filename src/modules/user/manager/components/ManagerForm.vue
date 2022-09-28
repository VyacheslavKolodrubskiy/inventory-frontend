<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="manager_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="24">
      <ACol
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.abbr.fullName')" name="name">
          <AInput v-model:value="form.name" />
        </AFormItem>
      </ACol>

      <ACol
        :sm="12"
        :xs="24"
      >
        <AFormItem label="Email" name="email">
          <AInput v-model:value="form.email" autocomplete="new-password" />
        </AFormItem>
      </ACol>

      <ACol :span="24">
        <AFormItem :label="$t('common.counterparty')" name="counterpartyId">
          <SelectCounterparty v-model:value="form.counterpartyId" />
        </AFormItem>
      </ACol>

      <ACol
        :sm="12"
        :xs="24"
      >
        <AFormItem :label="$t('common.password')" name="password">
          <PasswordStrengthProgress :password="form.password">
            <AInputPassword v-model:value="form.password" autocomplete="new-password" />
          </PasswordStrengthProgress>
        </AFormItem>
      </ACol>

      <ACol
        :sm="12"
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

      <ACol :span="24">
        <AFormItem :label="$t('common.warehouses')" name="warehouseIds">
          <SelectWarehouse
            :key="warehouseSelectKey"
            v-model:value="form.warehouseIds"
            :disabled="!form.counterpartyId"
            :filters="{ counterpartyId: getLabelInValueId(form.counterpartyId) }"
            mode="multiple"
          />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateManagerDto } from '../manager.dto';
import { ManagerRepository } from '../manager.repository';
import { vvEmail, vvPhone, vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import PasswordStrengthProgress from '@/shared/components/PasswordStrengthProgress.vue';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);

const { t } = useI18n();

const formattedPhone = ref('');
const loadingState = useLoading();

const isEditing = computed(() => !!props.dataId);
const isRequiredPassword = computed(() => !isEditing.value ? vvRequired : {});

const formRules = {
  name: vvRequired,
  password: [
    isRequiredPassword.value,
    {
      min: 6,
      message: t('validation.passwordLengthMessage'),
    },
  ],
  counterpartyId: vvRequired,
  warehouseIds: vvRequired,
  email: [vvEmail, vvRequired],
  phone: [vvPhone],
};

const form: UpdateManagerDto = reactive({
  name: '',
  phone: '',
  password: '',
  email: '',
  counterpartyId: null,
  warehouseIds: [],
});

const warehouseSelectKey = ref(0);

onMounted(() => {
  if (isEditing.value)
    readUser(props.dataId as UrlParam);
});

watch(
  () => form.counterpartyId,
  (newVal) => {
    if (newVal && !loadingState.isLoading.value) {
      warehouseSelectKey.value += 1;
      form.warehouseIds = [];
    }
  },
);

function readUser(id: UrlParam) {
  return Executor.run({
    request: ManagerRepository.read(id),
    loadingState,
    onResult(data) {
      form.name = data.name;
      form.email = data.email;
      form.phone = data.phone;
      form.counterpartyId = createLabelInValue(data.counterparty.title, data.counterparty.id);

      if (data.warehouses)
        form.warehouseIds = data.warehouses.map(el => createLabelInValue(el.title, el.id));
    },
  });
}

function onFinish(values: UpdateManagerDto) {
  if (formattedPhone.value)
    values.phone = `7${formattedPhone.value}`;

  values.counterpartyId = getLabelInValueId(values.counterpartyId);
  values.warehouseIds = values.warehouseIds.map(el => getLabelInValueId(el));
  emit('submit', values);
}
</script>
