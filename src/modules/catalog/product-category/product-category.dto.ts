import type { PaginationFilter } from '@/types';

export interface UpdateProductCategoryDto {
  title: string
}

export interface ProductCategoryFilters extends PaginationFilter {
  title?: string
}
