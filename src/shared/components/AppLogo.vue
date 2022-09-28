<template>
  <div class="app-logo" :class="{ 'app-logo--light': light }">
    <ThunderboltOutlined />
    <span v-show="!compact" class="app-logo__title">{{ $t('common.erpTitle') }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  light?: boolean
  compact?: boolean
}>(), {
  light: false,
  compact: false,
});
</script>
