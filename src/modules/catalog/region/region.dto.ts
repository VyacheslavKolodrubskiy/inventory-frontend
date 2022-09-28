import type { LabelInValueMixed, PaginationFilter, Sort } from '@/types';

export interface UpdateRegionDto {
  title: string
  countryId: LabelInValueMixed
}

export interface RegionFilters extends PaginationFilter, Sort<'title'> {
  title?: string
}
