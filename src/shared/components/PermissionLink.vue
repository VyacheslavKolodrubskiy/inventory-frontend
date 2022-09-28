<template>
  <Component :is="$canUse(props.permission) ? 'RouterLink' : 'span'">
    <slot />
  </Component>
</template>

<script lang="ts" setup>
import type { Nullable } from '@qlt2020/frutils';
import type { PermissionRole } from '../enums/common.enum';

const props = defineProps<{
  permission: Nullable<PermissionRole | PermissionRole[]>
}>();
</script>
