<template>
  <AButton type="text" @click="onClick">
    <MenuUnfoldOutlined v-if="appStore.isSidebarCollapsed" />
    <MenuUnfoldOutlined v-else />
  </AButton>
</template>

<script lang="ts" setup>
import { useBreakpoints } from '@/shared/composables/useBreakpoints';
import { useAppStore } from '@/shared/store/app.store';

const appStore = useAppStore();
const { isMobile } = useBreakpoints();

const onClick = () => {
  if (isMobile.value)
    appStore.toggleMobileMenu();
  else
    appStore.toggleSidebarCollapsed();
};
</script>
