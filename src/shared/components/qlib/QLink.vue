<template>
  <AButton
    v-if="isExternalLink"
    v-bind="$attrs"
    :href="to"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </AButton>
  <!-- manual prop "to" need to prevent typecheck error -->
  <RouterLink
    v-else
    v-slot="{ isActive, href, navigate }"
    custom
    v-bind="$props"
    :to="$props.to"
  >
    <AButton
      :class="isActive ? 'active' : ''"
      v-bind="$attrs"
      :href="href"
      @click="navigate"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </AButton>
  </RouterLink>
</template>

<script lang="ts">
/*
 * ATTENTION! The options API syntax is intentional here,
 * as defineProps not support complex types. (@timarito 25.04.2022)
 * https://github.com/vuejs/core/issues/4294
 */
import { RouterLink } from 'vue-router';

export default defineComponent({
  inheritAttrs: false,

  props: {
    // @ts-expect-error
    ...RouterLink.props,
    inactiveClass: String,
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http');
    },
  },
});
</script>
