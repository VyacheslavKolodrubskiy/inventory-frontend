import type { UserFilters } from '@/shared/dto/user.dto';
import type { LabelInValueMixed } from '@/types';

export interface UpdateManagerDto {
  name: string
  phone: string
  password: string
  email: string
  counterpartyId: LabelInValueMixed
  warehouseIds: LabelInValueMixed[]
}

export interface ManagerFilters extends UserFilters {
  warehouseId?: number[] | number
  counterpartyId?: LabelInValueMixed
}
