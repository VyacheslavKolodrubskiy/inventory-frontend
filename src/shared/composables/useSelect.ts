import type { Recordable } from '@qlt2020/frutils';
import { hasString, highlightString } from '@qlt2020/frutils';
import { useLoading } from '@/shared/composables/useLoading';
import { getSelectSortParams } from '@/shared/composables/usePagination';

interface UseSelectOptions<T, F> {
  fetchOptions: (params?: Partial<F>) => void
  label?: keyof T
}
export function useSelect<T extends Recordable, F>(props: Recordable, options: UseSelectOptions<T, F>) {
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
      all: 1,
      ...getSelectSortParams(label as string),
      ...props.filters,
    };
  });

  function getHighlightedText(option: T) {
    return state.searchQuery ? highlightString(option[label], state.searchQuery) : option[label];
  }

  function onSearch(value: string) {
    state.searchQuery = value;
  }

  function onFocus() {
    if (!state.options.length)
      fetchOptions(getQueryParams.value);
  }

  function filterOption(input: string, option: T) {
    return hasString(option[label], input);
  }

  return {
    ...toRefs(state),
    loadingState,
    getHighlightedText,
    filterOption,
    onSearch,
    onFocus,
  };
}
