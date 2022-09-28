<template>
  <Teleport to="body">
    <div class="tm-progress" :style="progressCSS">
      <div class="tm-progress__bar" :style="barPositionCSS">
        <div class="tm-progress__peg" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { initProgressBar } from '@/shared/components/ProgressBar/progress-bar';

const props = withDefaults(defineProps<{
  minimum?: number
  easing?: string
  speed?: number
  trickle?: boolean
  trickleSpeed?: number
}>(), {
  minimum: 0.08,
  speed: 200,
  easing: 'linear',
  trickle: true,
  trickleSpeed: 200,
});

const { progressCSS, barPositionCSS } = initProgressBar(props);
</script>
