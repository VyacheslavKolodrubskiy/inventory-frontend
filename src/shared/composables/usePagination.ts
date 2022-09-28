import type { ShallowReactive } from 'vue';
import type { PaginationParams, Sort, SortDirection } from '@/types';
import { DEFAULT_PER_PAGE, DEFAULT_SELECT_PER_PAGE } from '@/shared/config/constants';

export interface UsePaginationFields {
  total?: number
  lastPage?: number
  perPage?: number
  page?: number
}

export type UsePaginationReturn = ShallowReactive<Required<UsePaginationFields>>;

export function usePagination(options: UsePaginationFields = {}): UsePaginationReturn {
  const {
    total = 0, // from server
    lastPage = 1, // from server
    perPage = DEFAULT_PER_PAGE,
    page = 1, // current page
  } = options;

  return shallowReactive({
    perPage,
    page,
    total,
    lastPage,
  });
}

export function getPaginationParams(pagination: UsePaginationReturn): Required<PaginationParams> {
  return { page: pagination.page, perPage: pagination.perPage };
}

export function getSelectPaginationParams(): Required<PaginationParams> {
  return { page: 1, perPage: DEFAULT_SELECT_PER_PAGE };
}

export function getSelectSortParams<T extends string>(sort: T = 'title' as T, sortBy: SortDirection = 'asc'): Sort<T> {
  return { sort, sortBy };
}
