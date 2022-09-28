<template>
  <AAvatar
    :class="marked ? 'bg-success-100 text-success-500' : 'bg-gray-100 text-gray-500'"
    shape="square"
    :title="marked ? $t('common.marked') : $t('common.unmarked')"
  >
    <template #icon>
      <BarcodeOutlined />
    </template>
  </AAvatar>
</template>

<script lang="ts" setup>
defineProps<{
  marked: boolean
}>();
</script>
