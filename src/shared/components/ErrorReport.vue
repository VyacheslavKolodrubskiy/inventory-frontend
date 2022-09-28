<template>
  <ASpace direction="vertical">
    {{ message }}

    <AAlert
      v-if="description"
      :message="description"
      type="error"
    />

    <div class="text-gray-400">
      {{ $t('common.errorReport') }}
    </div>
  </ASpace>
</template>

<script setup lang="ts">
import { Alert as AAlert, Space as ASpace } from 'ant-design-vue';
withDefaults(defineProps<{
  message: string
  description?: string
}>(), {
  description: '',
});
</script>

