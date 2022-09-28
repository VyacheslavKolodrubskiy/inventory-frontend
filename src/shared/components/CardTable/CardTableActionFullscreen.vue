<template>
  <ATooltip placement="topRight">
    <template #title>
      {{ isFullscreen ? $t('common.windowed') : $t('common.fullscreen') }}
    </template>
    <AButton
      class="ant-btn-icon-only"
      type="text"
      @click="toggleFullscreen"
    >
      <FullscreenExitOutlined v-if="isFullscreen" />
      <FullscreenOutlined v-else />
    </AButton>
  </ATooltip>
</template>

<script lang="ts" setup>
import screenfull from 'screenfull';
import type { VueInstance } from '@vueuse/core';
import { toggleFullscreen as _toggleFullScreen } from '@/shared/utils/utils';

const props = defineProps<{
  element: VueInstance | null
}>();

const isFullscreen = ref(false);

function toggleFullscreen() {
  _toggleFullScreen(props.element!.$el as HTMLElement);
}
function onFullscreenChange() {
  isFullscreen.value = screenfull.isFullscreen;
}
onMounted(() => screenfull.on('change', onFullscreenChange));
onUnmounted(() => screenfull.off('change', onFullscreenChange));
</script>
