<template>
  <BaseSelect
    :options="state.options"
    :placeholder="$t('common.status')"
  />
</template>

<script setup lang="ts">
import { objectValues } from '@qlt2020/frutils';
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { DocumentStatus } from '@/shared/enums/status.enum';

const { t } = useI18n();

const state = reactive({
  options: objectValues(DocumentStatus).map(opt => ({ ...opt, title: t(opt.title) })),
});
</script>
