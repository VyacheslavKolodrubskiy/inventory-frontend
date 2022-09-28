<template>
  <div
    v-if="appStore.settings.fixedHeader"
    class="ant-layout-header page-header invisible"
  />
  <ALayoutHeader
    class="page-header"
    :class="headerClasses"
    :style="getHeaderStyle"
  >
    <template v-if="appStore.settings.navigationTop">
      <RouterLink class="page-header__logo" to="/">
        <AppLogo :light="isLightLogo" />
      </RouterLink>
      <MainMenu
        class="flex-auto"
        mode="horizontal"
        :theme="appStore.settings.headerTheme"
      />
    </template>

    <template v-else>
      <SiderTrigger class="mr-4 -ml-6" />
      <TheBreadcrumbs
        class="flex items-center"
        :class="{ 'ant-breadcrumb--light': appStore.settings.headerTheme === 'dark' }"
      />
    </template>

    <div class="ml-auto flex-shrink-0">
      <ARow :gutter="4">
        <ACol>
          <TheHeaderErrorLogAction />
        </ACol>
        <ACol>
          <ADropdown>
            <AButton class="page-header__action" type="text">
              <GlobalOutlined />
            </AButton>

            <template #overlay>
              <LocaleMenu />
            </template>
          </ADropdown>
        </ACol>

        <ACol>
          <TheHeaderUserPanel />
        </ACol>

        <ACol>
          <TheHeaderNavigationSettings />
        </ACol>
      </ARow>
    </div>
  </ALayoutHeader>
</template>

<script setup lang="ts">
import AppLogo from '@/shared/components/AppLogo.vue';
import LocaleMenu from '@/shared/components/LocaleMenu.vue';
import { useBreakpoints } from '@/shared/composables/useBreakpoints';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_MENU_WIDTH } from '@/shared/config/constants';
import TheBreadcrumbs from '@/shared/layouts/TheBreadcrumbs.vue';
import SiderTrigger from '@/shared/layouts/TheSidebar/SiderTrigger.vue';
import { useAppStore } from '@/shared/store/app.store';
import MainMenu from '@/shared/components/MainMenu.vue';
import TheHeaderNavigationSettings from '@/shared/layouts/TheHeader/TheHeaderNavigationSettings.vue';
import TheHeaderUserPanel from '@/shared/layouts/TheHeader/TheHeaderUserPanel.vue';
import TheHeaderErrorLogAction from '@/shared/layouts/TheHeader/TheHeaderErrorLogAction.vue';

const appStore = useAppStore();
const { isMobile } = useBreakpoints();

const getHeaderStyle = computed(() => {
  if (!appStore.settings.fixedHeader || appStore.settings.navigationTop || isMobile.value)
    return null;
  return {
    left: `${appStore.isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_MENU_WIDTH}px`,
  };
});
const headerClasses = computed(() => {
  return {
    'page-header--fixed': appStore.settings.fixedHeader,
    'page-header--light': appStore.settings.headerTheme === 'light',
    'w-full': appStore.settings.navigationTop,
  };
});

const isLightLogo = computed(() => {
  return (
    (appStore.settings.navigationTop && appStore.settings.headerTheme === 'dark')
    && !appStore.isLightNavigation
  );
});
</script>
