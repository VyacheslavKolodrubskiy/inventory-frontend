import type { Ref } from 'vue';
import { useProgressBar } from '@/shared/components/ProgressBar';
import type { LoadingService } from '@/types';

const state = reactive({
  globalLoadingCount: 0,
  secondaryLoadingCount: 0,
  pageLoading: false,
});

const { progressStart, progressDone, progressSet } = useProgressBar();

watch(
  () => state.secondaryLoadingCount,
  (newVal, oldVal) => {
    if (newVal === 0)
      return progressDone();
    if (oldVal === 0)
      return progressStart();

    progressSet(1.8 / Math.max(oldVal, newVal));
  },
);
watch(
  () => state.pageLoading,
  (newVal) => {
    if (newVal)
      state.secondaryLoadingCount += 1;
    else
      state.secondaryLoadingCount -= 1;
  },
);

export function usePageLoading() {
  const setPageLoading = (loading: boolean) => {
    state.pageLoading = loading;
  };

  return {
    setPageLoading,
    isLoading: toRef(state, 'pageLoading'),
  };
}

function useLoadingControls(loadingCountRef: Ref<number>): LoadingService {
  const isLoading = computed(() => loadingCountRef.value > 0);

  const startLoading = () => {
    loadingCountRef.value += 1;
  };
  const stopLoading = () => {
    // Prevent fast jumps
    setTimeout(() => {
      if (loadingCountRef.value > 0)
        loadingCountRef.value -= 1;
    });
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
}

export function useGlobalLoading() {
  return useLoadingControls(toRef(state, 'globalLoadingCount'));
}

export function useSecondaryLoading() {
  return useLoadingControls(toRef(state, 'secondaryLoadingCount'));
}

export function useLoading() {
  const loadingCount = ref(0);
  return useLoadingControls(loadingCount);
}
