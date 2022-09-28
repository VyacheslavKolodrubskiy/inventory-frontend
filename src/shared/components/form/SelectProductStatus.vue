<template>
  <BaseSelect
    :options="state.options"
    :placeholder="$t('common.productStatus')"
  />
</template>

<script setup lang="ts">
import { objectValues } from '@qlt2020/frutils';
import BaseSelect from '@/shared/components/form/BaseSelect.vue';
import { DocumentProductStatus } from '@/shared/enums/status.enum';
const { t } = useI18n();

const state = reactive({
  options: objectValues(DocumentProductStatus).map(opt => ({ ...opt, title: t(opt.title) })),
});
</script>
