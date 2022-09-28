<template>
  <div class="leading-tight">
    <div>
      <slot />
    </div>
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
import type { Nullable } from '@qlt2020/frutils';

const props = withDefaults(defineProps<{
  description?: Nullable<string>
}>(), {
  description: '',
});
</script>
