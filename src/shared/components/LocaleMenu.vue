<template>
  <AMenu :selected-keys="[localeStore.locale]" @click="setLocale">
    <AMenuItem v-for="locale in localeList" :key="locale.key">
      <span class="mr-1 lowercase">{{ locale.key }}</span>
      {{ locale.title }}
    </AMenuItem>
  </AMenu>
</template>

<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';
import { useLocaleStore } from '@/shared/store/locale.store';
import type { Locale } from '@/shared/config/locale-config';
import { localeList } from '@/shared/config/locale-config';

const localeStore = useLocaleStore();

const setLocale: MenuProps['onClick'] = async (menuInfo) => {
  await localeStore.setLocale(menuInfo.key as Locale);
  location.reload();
};
</script>
