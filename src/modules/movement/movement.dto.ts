import type { Nullable } from '@qlt2020/frutils';
import type { DateRange, LabelInValueMixed, PaginationFilter } from '@/types';

export interface MovementFilters extends PaginationFilter {
  title?: string
  dateRange?: Nullable<DateRange<string>>
  typeId?: LabelInValueMixed
  counterpartyId?: LabelInValueMixed
  warehouseId?: number []
  statusId?: LabelInValueMixed
  user?: string
  responsibleEmployee?: string
  createdUserId?: LabelInValueMixed
}
