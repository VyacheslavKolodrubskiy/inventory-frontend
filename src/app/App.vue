<template>
  <AConfigProvider :locale="antdLocale">
    <TheSessionAlert />
    <TheNetworkAlert />
    <RouterView />
    <ProgressBar easing="ease" :speed="500" />
  </AConfigProvider>
</template>

<script setup lang="ts">
import { ProgressBar } from '@/shared/components/ProgressBar';
import { useAntdLocales } from '@/shared/composables/useAntdLocales';
import TheSessionAlert from '@/shared/components/TheSessionAlert.vue';
import TheNetworkAlert from '@/shared/components/TheNetworkAlert.vue';
import { useTitle } from '@/shared/composables/useTitle';

const { antdLocale } = useAntdLocales();

useTitle();
</script>
