import type { Nullable } from '@qlt2020/frutils';
import type { DateRange, EntityID, LabelInValueMixed, PaginationFilter, ProductRegistryID } from '@/types';

export interface InventoryFilters {
  title?: string
  dateRange?: Nullable<DateRange<string>>
  counterpartyId?: LabelInValueMixed
  statusId?: LabelInValueMixed
  warehouseId?: LabelInValueMixed
  authorId?: LabelInValueMixed
  responsibleUserId?: LabelInValueMixed
}

export interface InventoryProductFilters extends PaginationFilter {
  productTitle?: string
  productCategoryId?: LabelInValueMixed
  counterpartyId?: LabelInValueMixed
  statusId?: LabelInValueMixed
  warehousePlaceId?: LabelInValueMixed
  markId?: LabelInValueMixed
  markable?: LabelInValueMixed
}

export interface CreateInventoryDto {
  title: string
  description: string
  warehouseId: LabelInValueMixed
  warehousePlaceId?: LabelInValueMixed
  responsibleUserId: LabelInValueMixed
  products: ProductRegistryID[]
}

export interface UpdateInventoryDto {
  title: string
  description: string
  responsibleUserId: LabelInValueMixed
}

export type RemoveInventoryProductDto = EntityID[];
