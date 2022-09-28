<template>
  <ABreadcrumb :routes="routes">
    <template #itemRender="{ route }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ $t(route.breadcrumbName) }}
      </span>
      <RouterLink v-else :to="route.path">
        {{ $t(route.breadcrumbName) }}
      </RouterLink>
    </template>
  </ABreadcrumb>
</template>

<script lang="ts" setup>
import { notNullable } from '@qlt2020/frutils';
import type { Route } from 'ant-design-vue/es/breadcrumb/Breadcrumb';

const _route = useRoute();

const routes = computed((): Route[] => {
  return _route.matched
    .filter(item => notNullable(item.meta.breadcrumbName))
    .map(item => ({
      ...item.name && { path: item.path },
      breadcrumbName: item.meta.breadcrumbName,
    } as Route));
});
</script>
