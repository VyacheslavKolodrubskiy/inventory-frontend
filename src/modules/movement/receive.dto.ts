import type { EntityID, LabelInValueMixed, PaginationFilter } from '@/types';

interface ReceiveProduct {
  productId: number
  warehousePlaceId: number
  count: number
}

interface CreateReceive {
  title: string
  toWarehouseId: LabelInValueMixed
  responsibleUserId: LabelInValueMixed
  liabilityUserId: LabelInValueMixed
}

export interface ReceiveProductFilters extends PaginationFilter {
  productTitle?: string
  productCategoryTitle?: string
  warehousePlaceId?: LabelInValueMixed
  statusId?: LabelInValueMixed
  markId?: LabelInValueMixed
  markable?: LabelInValueMixed
}

export interface CreateReceiveManualyDto extends CreateReceive {
  products: ReceiveProduct[]
}

export interface CreateReceiveImportDto extends CreateReceive {
  file: File
}

export interface UpdateReceiveDto {
  title: string
  responsibleUserId: LabelInValueMixed
}

export interface UpdateReceiveProductDto {
  id: EntityID
  warehousePlaceId: LabelInValueMixed
  count?: number
}

export type RemoveReceiveProductDto = EntityID[];
