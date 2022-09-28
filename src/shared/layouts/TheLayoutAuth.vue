<template>
  <div class="auth-layout">
    <div class="auth-layout__bar">
      <ADropdown placement="bottomRight">
        <AButton class="ant-btn-icon-only ml-auto text-gray-600" type="text">
          <GlobalOutlined class="text-lg" />
        </AButton>

        <template #overlay>
          <LocaleMenu />
        </template>
      </ADropdown>
    </div>

    <div class="auth-layout__content">
      <div class="auth-layout__header">
        <AppLogo class="auth-layout__logo" />
        <p class="auth-layout__desc">
          {{ $t('common.erpDescription') }}
        </p>
      </div>

      <RouterView class="auth-layout__container" />

      <div class="text-center mt-6 text-gray-500">
        {{ $t('common.allRightsReserved') }} © 2022 <a href="https://qlt.kz/" target="_blank">QLT IT Company</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppLogo from '@/shared/components/AppLogo.vue';
import LocaleMenu from '@/shared/components/LocaleMenu.vue';
</script>
