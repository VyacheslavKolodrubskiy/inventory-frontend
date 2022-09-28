<template>
  <a :download="download" :href="url">
    <DownloadOutlined class="mr-1 text-base text-gray-600" />
    <!--    <span class="mr-1 text-xs text-gray-500">DOCX</span> -->
    <slot />
  </a>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  url: string
  download?: boolean
}>(), {
  download: false,
});
</script>
