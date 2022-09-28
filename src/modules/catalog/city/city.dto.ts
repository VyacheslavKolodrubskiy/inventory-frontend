import type { LabelInValueMixed, PaginationFilter, Sort } from '@/types';

export interface UpdateCityDto {
  title: string
  regionId: LabelInValueMixed
  slug: string
}

export interface CityFilters extends PaginationFilter, Sort<'title'> {
  title?: string
}
