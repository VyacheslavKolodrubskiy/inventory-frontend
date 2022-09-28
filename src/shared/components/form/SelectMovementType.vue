<template>
  <BaseSelect
    :options="state.options"
    :placeholder="$t('common.documentType')"
  />
</template>

<script setup lang="ts">
import { objectValues } from '@qlt2020/frutils';
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { MovementType } from '@/shared/enums/status.enum';

const { t } = useI18n();

const state = reactive({
  options: objectValues(MovementType).map(opt => ({ ...opt, title: t(opt.title) })),
});
</script>
