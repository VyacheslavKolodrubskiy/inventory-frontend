import type { Nullable } from '@qlt2020/frutils';
import type { DateRange, LabelInValueMixed, PaginationFilter } from '@/types';

export interface MarkingProductFilters extends PaginationFilter {
  productTitle?: string
  productCategoryId?: LabelInValueMixed
  warehousePlaceId?: LabelInValueMixed
  statusId?: LabelInValueMixed
  markId?: LabelInValueMixed
  markable?: LabelInValueMixed
}

export interface CreateMarkingDto {
  title: string
  warehouseId: LabelInValueMixed
  responsibleUserId: LabelInValueMixed
}

export interface UpdateMarkingDto {
  title: string
  responsibleUserId: LabelInValueMixed
}

export interface CreateMarkingProductDto {
  productId: number
  warehousePlaceId: LabelInValueMixed
}

export interface UpdateMarkingProductDto {
  productId: number
  warehousePlaceId: LabelInValueMixed
}

export interface MarkingFilters extends PaginationFilter {
  title?: string
  dateRange?: Nullable<DateRange<string>>
  counterpartyId?: LabelInValueMixed
  warehouseId?: Nullable<number>
  statusId?: LabelInValueMixed
  respUserId?: LabelInValueMixed
  createdUserId?: LabelInValueMixed
}
