<template>
  <APopover trigger="focus">
    <template #content>
      <div class="w-75">
        {{ $t('common.passwordStrength') }}: <b class="lowercase">{{ passwordStrength.text }}</b>
        <AProgress
          class="ant-progress-steps--full"
          :percent="passwordStrength.percent"
          :show-info="false"
          :steps="4"
          :stroke-color="passwordStrength.color"
          :stroke-width="4"
        />
      </div>
    </template>

    <slot />
  </APopover>
</template>

<script lang="ts" setup>
import { getPasswordStrength } from '@/shared/utils/password-strength';
const props = withDefaults(defineProps<{
  password: string
}>(), {
  password: '',
});

const ColorMap = {
  0: '#ff4d4f',
  1: '#ff7a45',
  2: '#ffa940',
  3: '#73d13d',
};

const passwordStrength = computed(() => {
  const strength = getPasswordStrength(props.password);

  return {
    text: strength.value,
    color: ColorMap[(strength.id as keyof typeof ColorMap)],
    percent: strength.percent,
  };
});
</script>
