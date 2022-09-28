<template>
  <ADrawer
    v-if="isMobile"
    v-model:visible="appStore.showMobileMenu"
    class="mobile-drawer"
    placement="left"
    :width="SIDEBAR_MENU_WIDTH"
  >
    <TheSider />
  </ADrawer>
  <TheSider v-else />
</template>

<script setup lang="ts">
import TheSider from './TheSider.vue';
import { useAppStore } from '@/shared/store/app.store';
import { useBreakpoints } from '@/shared/composables/useBreakpoints';
import { SIDEBAR_MENU_WIDTH } from '@/shared/config/constants';

const visible = ref(true);
const appStore = useAppStore();
const { isMobile } = useBreakpoints();
</script>
