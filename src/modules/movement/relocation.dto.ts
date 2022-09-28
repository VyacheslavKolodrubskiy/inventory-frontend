import type { EntityID, LabelInValueMixed, PaginationFilter } from '@/types';

interface RelocationProduct {
  warehouseProductId: number
  amount?: number
}

export interface RelocationProductFilters extends PaginationFilter {
  title?: string
  marked?: LabelInValueMixed
  categoryTitle?: string
  warehousePlaceId?: LabelInValueMixed
}

export interface CreateRelocationDto {
  title: string
  toWarehouseId: LabelInValueMixed
  fromWarehouseId: LabelInValueMixed
  comment?: string
  responsibleUserId: LabelInValueMixed
  liabilityUserId: LabelInValueMixed
  products: RelocationProduct[]
}

export interface UpdateRelocationDto {
  title: string
  comment: string
  responsibleUserId: LabelInValueMixed
  liabilityUserId: LabelInValueMixed
}

export type RemoveRelocationProductDto = EntityID[];
