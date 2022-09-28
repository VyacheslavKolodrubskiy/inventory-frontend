<template>
  <ATooltip>
    <template #title>
      {{ $t('action.refreshData') }}
    </template>
    <AButton
      class="ant-btn-icon-only"
      :disabled="isPending"
      type="text"
      @click="reload"
    >
      <ReloadOutlined />
    </AButton>
  </ATooltip>
</template>

<script lang="ts" setup>
import { sleep } from '@qlt2020/frutils';
import { TABLE_MAX_UPDATE_RATE } from '@/shared/config/constants';

const emit = defineEmits(['reload']);

const isPending = ref(false);

async function reload() {
  isPending.value = true;
  emit('reload');

  await sleep(TABLE_MAX_UPDATE_RATE);

  isPending.value = false;
}
</script>
