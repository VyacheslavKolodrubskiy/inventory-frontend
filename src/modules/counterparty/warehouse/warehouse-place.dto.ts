import type { LabelInValueMixed, PaginationFilter } from '@/types';

export interface UpdateWarehousePlaceDto {
  title: string
  description: string
  warehouseId: LabelInValueMixed
}

export interface WarehousePlaceFilters extends PaginationFilter {
  warehouseId?: number | null
}
