import type { PaginationFilter, Sort } from '@/types';

export interface UserDto {
  name: string
  email: string
  phone: string
  password?: string
}

export interface UserFilters extends PaginationFilter, Sort<'name'> {
  name?: string
  phone?: string
  email?: string
}
