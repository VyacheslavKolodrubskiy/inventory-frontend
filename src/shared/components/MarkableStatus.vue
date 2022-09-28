<template>
  <AAvatar
    :class="markable ? 'bg-gray-100 text-primary-500' : 'bg-gray-100 text-gray-500'"
    shape="square"
    :title="markable ? $t('common.markable') : $t('common.unmarkable')"
  >
    <template #icon>
      <TagOutlined />
    </template>
  </AAvatar>
</template>

<script lang="ts" setup>
defineProps<{
  markable: boolean
}>();
</script>
