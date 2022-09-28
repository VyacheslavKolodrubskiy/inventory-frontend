import type { PaginationFilter, Sort } from '@/types';

export interface UpdateCountryDto {
  title: string
  slug: string
}

export interface CountryFilters extends PaginationFilter, Sort<'title'> {
  title?: string
}
