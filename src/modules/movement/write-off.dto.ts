import type { EntityID, LabelInValueMixed, PaginationFilter } from '@/types';

interface WriteOffProduct {
  warehouseProductId: number
  amount?: number
}

export interface WriteOffProductFilters extends PaginationFilter {
  title?: string
  marked?: boolean
  categoryTitle?: string
  warehousePlaceId?: number | null
}

export interface CreateWriteOffDto {
  title: string
  fromWarehouseId: LabelInValueMixed
  responsibleUserId: LabelInValueMixed
  comment?: string
  products: WriteOffProduct[]
}

export interface UpdateWriteOffDto {
  title: string
  comment: string
  responsibleUserId: LabelInValueMixed
}

export interface UpdateWriteOffProductDto {
  id: EntityID
  count: number
}

export type RemoveWriteOffProductDto = EntityID[];
