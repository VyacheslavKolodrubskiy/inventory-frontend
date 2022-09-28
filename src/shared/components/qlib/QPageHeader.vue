<template>
  <APageHeader
    :ghost="false"
    v-bind="events"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </APageHeader>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  back?: boolean
}>(), {
  back: false,
});

const router = useRouter();

const events = computed(() => props.back ? { onBack: () => router.go(-1) } : null);
</script>
