import type { Recordable } from '@qlt2020/frutils';
import { highlightString } from '@qlt2020/frutils';
import { useDebounceFn } from '@vueuse/core';
import { INPUT_DEBOUNCE_DELAY, MaxAmount } from '@/shared/config/constants';
import { useLoading } from '@/shared/composables/useLoading';
import { getSelectPaginationParams, getSelectSortParams } from '@/shared/composables/usePagination';

interface UseSelectOptions<T, F> {
  fetchOptions: (params?: Partial<F>) => void
  label?: keyof T
}
export function useSearch<T extends Recordable, F extends Recordable>(props: Recordable, options: UseSelectOptions<T, F>) {
  const {
    fetchOptions,
    label = 'title',
  } = options;

  const loadingState = useLoading();
  const state = reactive({
    options: [] as T[],
    searchQuery: '',
  });

  const getQueryParams = computed(() => {
    return {
      ...getSelectPaginationParams(),
      ...getSelectSortParams(label as string),
      ...props.filters,
    };
  });

  const debouncedFetch = useDebounceFn((params?: Partial<F>) => {
    fetchOptions({ ...params, ...getQueryParams.value });
  }, INPUT_DEBOUNCE_DELAY);

  function getHighlightedText(option: T) {
    return state.searchQuery ? highlightString(option[label], state.searchQuery) : option[label];
  }

  function onSearch(value: string) {
    state.searchQuery = value;

    if (!value) {
      state.options = [];
      return;
    }

    // @ts-expect-error
    debouncedFetch({ [label]: value });
  }

  function onFocus() {
    if (!state.options.length) {
      fetchOptions({
        ...getQueryParams.value,
        perPage: MaxAmount.InitialSearchItems,

      });
    }
  }

  return {
    ...toRefs(state),
    loadingState,
    getHighlightedText,
    onSearch,
    onFocus,
  };
}
