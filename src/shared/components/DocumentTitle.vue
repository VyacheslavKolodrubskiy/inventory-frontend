<template>
  <div>
    <Component
      :is="DocumentType[type].icon"
      class="mr-1"
      :class="[DocumentType[type].class]"
    />
    {{ $t(DocumentType[type].title) }} #{{ id }} {{ title }}
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { DocumentType } from '@/shared/enums/common.enum';

defineProps<{
  type: keyof typeof DocumentType
  id: string | number
  title: string
}>();
</script>
