import type { UploadFile } from 'ant-design-vue';
import type { LabelInValueMixed, PaginationFilter } from '@/types';

export interface UpdateProductDto {
  title: string
  description: string
  categoryId: LabelInValueMixed
  unitId: LabelInValueMixed
  markable: boolean
  articular: string
  files?: UploadFile[]
}

export interface DeleteProductDto {
  productId?: string
  imageId: string
}

export interface ProductFilters extends PaginationFilter {
  title?: string
  description?: string
  categoryId?: LabelInValueMixed
  unitId?: LabelInValueMixed
  markable?: boolean
}
