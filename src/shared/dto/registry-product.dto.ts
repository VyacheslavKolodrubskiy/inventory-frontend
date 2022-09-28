import type { LabelInValueMixed, PaginationFilter } from '@/types';

export interface RegistryProductFilters extends PaginationFilter {
  productTitle?: string
  counterpartyId?: LabelInValueMixed
  productCategoryId?: LabelInValueMixed
  warehouseId?: LabelInValueMixed
  warehousePlaceId?: LabelInValueMixed
  liabilityUserId?: LabelInValueMixed
  markId?: LabelInValueMixed
  markable?: LabelInValueMixed
}
