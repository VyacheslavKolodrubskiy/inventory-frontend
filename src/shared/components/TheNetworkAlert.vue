<template>
  <AAlert
    v-if="!isOnline"
    banner
    closable
    show-icon
    type="error"
  >
    <template #message>
      {{ $t('common.noInternetConnection') }}
    </template>
  </AAlert>
</template>

<script lang="ts" setup>
import { useOnline } from '@vueuse/core';

const isOnline = useOnline();
</script>
