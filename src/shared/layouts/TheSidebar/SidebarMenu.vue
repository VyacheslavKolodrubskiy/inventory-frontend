<template>
  <ASubMenu v-if="menuItem.children && menuItem.children.length" :key="menuItem.title">
    <template v-if="menuItem.icon" #icon>
      <Component :is="menuItem.icon" />
    </template>
    <template #title>
      {{ $t(menuItem.title) }}
    </template>

    <SidebarMenu
      v-for="childItem in menuItem.children"
      :key="childItem.title"
      :menu-item="childItem"
    />
  </ASubMenu>
  <template v-else>
    <AMenuItem :key="menuItem.title">
      <template v-if="menuItem.icon" #icon>
        <Component :is="menuItem.icon" />
      </template>
      <RouterLink :to="{ name: menuItem.routeName }">
        {{ $t(menuItem.title) }}
      </RouterLink>
    </AMenuItem>
  </template>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/shared/layouts/TheSidebar/sidebar';

defineProps<{
  menuItem: MenuItem
}>();
</script>
