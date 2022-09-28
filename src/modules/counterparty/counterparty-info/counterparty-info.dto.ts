import type { LabelInValueMixed, PaginationFilter, Sort } from '@/types';

export interface UpdateCounterpartyInfoDto {
  title: string
  bin: string
  address: string
  email: string
  phone: string
  alias: string
  logo?: string
  cityId?: LabelInValueMixed
}

export interface CounterpartyInfoFilters extends PaginationFilter, Sort<'title'> {
  name?: string
  phone?: string
  title?: string
  bin?: string
  address?: string
  email?: string
  cityId?: LabelInValueMixed
  regionId?: LabelInValueMixed
}
