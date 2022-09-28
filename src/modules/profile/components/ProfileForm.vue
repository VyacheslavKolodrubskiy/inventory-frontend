<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="profile_form"
    ref="profileForm"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="24">
      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('common.abbr.fullName')" name="name">
          <AInput v-model:value="state.form.name" />
        </AFormItem>
      </ACol>

      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('common.mail')" name="email">
          <AInput v-model:value="state.form.email" />
        </AFormItem>
      </ACol>

      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('common.phone')" name="phone">
          <AInput
            v-model:value="state.form.phone"
            v-maska="'+7 (###) ### ## ##'"
            @maska="state.formattedPhone = $event.target.dataset.maskRawValue"
          />
        </AFormItem>
      </ACol>
    </ARow>

    <AButton
      class="p-0 h-auto"
      type="link"
      @click="changePasswordPanelVisible = !changePasswordPanelVisible"
    >
      {{ $t('common.changePassword') }}
    </AButton>

    <ARow v-if="changePasswordPanelVisible" :gutter="24">
      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('common.newPassword')" name="password">
          <PasswordStrengthProgress :password="state.form.password">
            <AInputPassword v-model:value="state.form.password" autocomplete="new-password" />
          </PasswordStrengthProgress>
        </AFormItem>
      </ACol>

      <ACol :sm="12" :xs="24">
        <AFormItem :label="$t('common.repeatNewPassword')" name="password_confirmation">
          <AInputPassword v-model:value="state.form.password_confirmation" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { FormExpose } from 'ant-design-vue/es/form/Form';
import type { Rule } from 'ant-design-vue/es/form';
import { useLoading } from '@/shared/composables/useLoading';
import { vvPhone, vvRequired } from '@/shared/config/validation-rules';
import type { ValidationRules } from '@/types';
import { Executor } from '@/shared/network/executor';
import { UserRepository } from '@/shared/repository/user.repository';
import PasswordStrengthProgress from '@/shared/components/PasswordStrengthProgress.vue';
import type { UserDto } from '@/shared/dto/user.dto';

const emit = defineEmits(['submit']);

interface ProfileForm extends UserDto {
  password_confirmation: string
}
const state = reactive({
  form: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  } as ProfileForm,
  formattedPhone: '',
});

const { t } = useI18n();
const loadingState = useLoading();

const profileForm = ref();
const changePasswordPanelVisible = ref(false);

onMounted(() => {
  readProfile();
});

const isEmptyInputPassword = computed(() => !state.form.password);

const formRules = computed((): ValidationRules => {
  return {
    name: vvRequired,
    email: vvRequired,
    phone: [
      vvPhone,
    ],
    password: {
      required: !isEmptyInputPassword.value,
      message: vvRequired.message,
    },
    password_confirmation: [
      {
        required: !isEmptyInputPassword.value,
        message: vvRequired.message,
      },
      { validator: validatePassword },
    ],
  };
});

watch(() => state.form.password, (newVal) => {
  if (newVal)
    return;

  nextTick()
    .then(() => (profileForm?.value as FormExpose).clearValidate('password'));
});

function readProfile() {
  return Executor.run({
    request: UserRepository.read(),
    loadingState,
    onResult(data) {
      state.form.name = data.name;
      state.form.email = data.email;
      state.form.phone = data.phone;
    },
  });
}

function onFinish(values: ProfileForm) {
  values.phone = state.formattedPhone ? `7${state.formattedPhone}` : values.phone;
  const { password_confirmation, ...data } = values;
  emit('submit', data);
}

async function validatePassword(_rule: Rule, value: string) {
  return state.form.password !== value ? Promise.reject(t('validation.notMatchedPasswords')) : Promise.resolve();
}
</script>
