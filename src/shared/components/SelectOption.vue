<template>
  <div class="leading-tight">
    <div v-html="title" />
    <ATypographyText
      v-if="description"
      class="text-xs"
      type="secondary"
    >
      {{ description }}
    </ATypographyText>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '',
});
</script>
