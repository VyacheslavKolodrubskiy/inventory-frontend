<template>
  <div
    v-if="appStore.settings.fixedSidebar"
    v-show="showSider"
    class="invisible"
    :style="getStubStyle"
  />
  <ALayoutSider
    v-show="showSider"
    :class="{ 'ant-layout-sider--fixed': appStore.settings.fixedSidebar }"
    :collapsed="appStore.isSidebarCollapsed"
    :collapsed-width="SIDEBAR_COLLAPSED_WIDTH"
    :theme="appStore.settings.sidebarTheme"
    :width="SIDEBAR_MENU_WIDTH"
  >
    <div class="ant-layout-header page-header" :class="getSiderHeaderClass">
      <RouterLink to="/">
        <AppLogo :compact="appStore.isSidebarCollapsed" :light="!appStore.isLightNavigation" />
      </RouterLink>
    </div>

    <TheSidebarDropdownAction v-if="$canUse('Manager')" />

    <MainMenu
      class="scrollbar-thin"
      :class="{ 'scrollbar-thin--dark': appStore.settings.sidebarTheme === 'dark' }"
      mode="inline"
      :theme="appStore.settings.sidebarTheme"
    />
  </ALayoutSider>
</template>

<script lang="ts" setup>
import TheSidebarDropdownAction from './TheSidebarDropdownAction.vue';
import { useBreakpoints } from '@/shared/composables/useBreakpoints';
import AppLogo from '@/shared/components/AppLogo.vue';
import MainMenu from '@/shared/components/MainMenu.vue';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_MENU_WIDTH } from '@/shared/config/constants';
import { useAppStore } from '@/shared/store/app.store';

const appStore = useAppStore();
const { isMobile } = useBreakpoints();
const visible = ref(true);

watch(isMobile, (_isMobile) => {
  if (_isMobile)
    appStore.isSidebarCollapsed = false;
});
const showSider = computed(() => !appStore.settings.navigationTop);

const getSiderHeaderClass = computed(() => {
  return {
    'page-header--light': appStore.isLightNavigation,
    'px-0 justify-center': appStore.isSidebarCollapsed,
  };
});
const getStubStyle = computed(() => {
  const width = `${appStore.isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_MENU_WIDTH}px`;
  return {
    width,
    flex: `0 0 ${width}`,
  };
});
</script>
