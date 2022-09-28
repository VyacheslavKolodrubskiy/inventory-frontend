import type { Fn } from '@vueuse/core';

export function onRouteChangeSubmit(cb: Fn) {
  const route = useRoute();

  const currentRouteName = route.name;

  onMounted(() => {
    cb();
  });

  watch(
    route, (_, current) => {
      if (current?.name === currentRouteName)
        cb();
    },
  );
}
