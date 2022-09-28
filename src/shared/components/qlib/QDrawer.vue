<template>
  <ADrawer
    visible
    :width="sizes[size]"
    @close="onClose"
  >
    <template #closeIcon>
      <LeftOutlined v-if="hasPrevPage" />
      <CloseOutlined v-else />
    </template>

    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </ADrawer>
</template>

<script lang="ts" setup>
import { useGo } from '@/shared/composables/usePage';
import type { DrawerSize } from '@/types';

const props = withDefaults(defineProps<{
  size?: DrawerSize
}>(), {
  size: 'md',
});

const sizes = {
  sm: 400,
  md: 600,
  lg: 800,
};

const hasPrevPage = window.history.state?.back;
const router = useRouter();
const { goToModalParent } = useGo();

function onClose() {
  if (hasPrevPage)
    router.back();
  else
    goToModalParent();
}
</script>
