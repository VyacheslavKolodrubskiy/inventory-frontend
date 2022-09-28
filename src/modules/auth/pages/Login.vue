<template>
  <AForm
    class="w-90"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <h3 class="mb-5">
      {{ $t('common.authorize') }}
    </h3>

    <AFormItem name="email">
      <AInput
        v-model:value="form.email"
        :placeholder="$t('common.login')"
        size="large"
      >
        <template #prefix>
          <UserOutlined class="text-gray-400" />
        </template>
      </AInput>
    </AFormItem>

    <AFormItem name="password">
      <AInputPassword
        v-model:value="form.password"
        :placeholder="$t('common.password')"
        size="large"
      >
        <template #prefix>
          <LockOutlined class="text-gray-400" />
        </template>
      </AInputPassword>
    </AFormItem>

    <!-- <AFormItem>
      <div class="flex justify-between">
        <RouterLink to="/">
          {{ $t('common.forgotPassword') }}
        </RouterLink>
    </AFormItem> -->

    <AButton
      block
      html-type="submit"
      :loading="loadingState.isLoading.value"
      size="large"
      type="primary"
    >
      {{ $t('common.enter') }}
    </AButton>
  </AForm>
</template>

<script setup lang="ts">
import { vvRequired } from '@/shared/config/validation-rules';
import { PageName } from '@/shared/enums/common.enum';
import type { ValidationRules } from '@/types';
import { useSecondaryLoading } from '@/shared/composables/useLoading';
import { Executor } from '@/shared/network/executor';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { useAuthStore } from '@/shared/store/auth.store';
import type { LoginDto } from '@/modules/auth/auth.dto';

const { t } = useI18n();

const formRules: ValidationRules = {
  email: [
    vvRequired,
  ],
  password: [
    vvRequired,
    {
      min: 6,
      message: t('validation.passwordLengthMessage'),
    },
  ],
};

const route = useRoute();
const router = useRouter();
const loadingState = useSecondaryLoading();

const form: LoginDto = reactive({
  email: '',
  password: '',
});

function onFinish(values: LoginDto) {
  Executor.run({
    request: AuthRepository.login(values),
    loadingState,
    onResult(data) {
      const authStore = useAuthStore();
      authStore.login(data.token);
      const routeLocation = route.query.redirect ? { path: route.query.redirect } : { name: PageName.BASE_HOME };
      router.push(routeLocation);
    },
  });
}
</script>
