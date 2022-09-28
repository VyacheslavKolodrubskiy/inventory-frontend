<template>
  <ADropdown :trigger="['click']">
    <AButton :disabled="!count">
      <CheckSquareFilled :class="{ 'text-primary-500': count }" />
      {{ $t('common.selected') }}: {{ count }}
      <DownOutlined />
    </AButton>
    <template #overlay>
      <AMenu>
        <slot />
      </AMenu>
    </template>
  </ADropdown>
</template>

<script lang="ts" setup>
defineProps<{
  count: number
}>();
</script>
