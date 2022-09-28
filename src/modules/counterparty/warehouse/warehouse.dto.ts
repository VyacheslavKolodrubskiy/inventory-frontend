import type { LabelInValueMixed, PaginationFilter } from '@/types';

export interface UpdateWarehouseDto {
  title: string
  description: string
  counterpartyId: LabelInValueMixed
  location: number[]
  latitude?: number
  longitude?: number
  cityId: LabelInValueMixed
  image: string
}

export interface WarehouseFilters extends PaginationFilter {
  name?: string
  title?: string
  warehousePlaceTitle?: string
  description?: string
  cityId?: LabelInValueMixed
  regionId?: LabelInValueMixed
  counterpartyId?: LabelInValueMixed
  counterparty?: number
}
