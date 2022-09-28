<template>
  <Teleport :disabled="!fullPage" to="body">
    <Transition ref="root" :name="transition">
      <div
        v-show="active"
        :aria-busy="active"
        aria-label="Loading"
        class="tm-overlay"
        :class="{ 'tm-overlay--full-page': fullPage }"
        tabindex="0"
      >
        <div
          class="tm-background"
          :class="{ 'tm-background--dark': dark }"
          :style="bgStyle"
        />
        <div class="tm-icon">
          <slot name="before" />
          <slot>
            <div class="loader-jaw mb-4 ml-5" :class="{ 'loader-jaw--dark': dark }" />
          </slot>
          <div
            v-if="fullPage"
            class="tm-icon__text"
            :class="dark ? 'text-white' : 'text-primary-500'"
          >
            {{ $t('common.loading') }}...
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { getScrollWidth } from '@qlt2020/frutils';

const props = withDefaults(defineProps<{
  opacity?: number
  blur?: string
  transition?: string
  dark?: boolean
  active?: boolean
  fullPage?: boolean
}>(), {
  blur: '2px',
  opacity: 0.6,
  transition: 'fade-in-linear',
});

const bgStyle = computed(() => ({
  opacity: props.opacity,
  backdropFilter: `blur(${props.blur})`,
}));

const scrollWidth = getScrollWidth();

watch(
  () => props.active,
  (newVal) => {
    if (!props.fullPage)
      return;

    if (newVal) {
      document.body.classList.add('overflow-hidden');
      document.body.style.paddingRight = `${scrollWidth}px`;
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.style.paddingRight = '';
    }
  },
);
</script>

<style>
.tm-overlay {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
}
.tm-overlay--full-page {
  position: fixed;
}
.tm-background {
  z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: #fff;
}
.tm-background--dark {
  background-color: #434343;
}
.tm-icon {
  position: relative;
  z-index: 2;
  text-align: center;
}
.tm-icon__text {
  font-size: 12px;
  margin-top: 8px;
}
</style>
