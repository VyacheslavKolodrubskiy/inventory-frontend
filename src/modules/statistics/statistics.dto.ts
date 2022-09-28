import type { LabelInValueMixed } from '@/types';

export interface CommonStatisticsFilters {
  counterpartyId: number
}
export interface DetailedStatisticsFilters {
  counterpartyId: LabelInValueMixed
  warehouseId?: LabelInValueMixed
}
