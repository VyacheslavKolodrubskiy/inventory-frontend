<template>
  <span class="text-gray-500">
    {{ $t('common.created[0]') }}
    {{ Format.datetimeFull(date) }}
    <ADivider type="vertical" />
    {{ author }}
  </span>
</template>

<script lang="ts" setup>
import { Format } from '@/shared/utils/format';
import type { DateFormat } from '@/types';

defineProps<{
  date: DateFormat
  author: string
}>();
</script>
