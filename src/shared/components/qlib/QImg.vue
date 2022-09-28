<template>
  <img alt="" :src="imgUrl">
</template>

<script setup lang="ts">
const props = defineProps({
  src: { type: String, required: true },
});

const imgUrl = computed(() => (new URL(`/src/assets/img/${props.src}`, import.meta.url)).toString());
</script>
