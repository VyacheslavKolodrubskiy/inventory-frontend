<template>
  <ADropdown
    v-if="getActions.length"
    placement="bottomRight"
    :trigger="['click']"
  >
    <AButton class="ant-btn-icon-only" type="text">
      <MenuOutlined />
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenuItem v-for="action in getActions" :key="action.title">
          <RouterLink v-if="action.to" :to="getRoute(action)">
            {{ action.title }}
          </RouterLink>
          <a
            v-else
            @click.prevent="action.click?.(record)"
          >
            {{ action.title }}
          </a>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { hasOwn, isFunction } from '@qlt2020/frutils';
import type { TableAction } from '@/types';

const props = withDefaults(defineProps<{
  actions?: TableAction[]
  record: any
}>(), {
  actions: () => [],
});

const getActions = computed(() => {
  return props.actions.filter(action => !hasOwn(action, 'condition') || !!action.condition?.(props.record));
});
const getRoute = (action: TableAction) => isFunction(action.to) ? action.to(props.record) : action.to as RouteLocationRaw;
</script>
