import type { LabelInValueMixed } from '../../../types';
import type { PaginationFilter } from '@/types';

export interface UpdateUnitDto {
  title: string
  alias: string
  typeId: LabelInValueMixed

}
export interface UnitFilters extends PaginationFilter {
  title?: string
  alias?: string
  typeId?: LabelInValueMixed
}
