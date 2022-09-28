import type { Nullable, Recordable } from '@qlt2020/frutils';
import type { LabelInValueType } from 'ant-design-vue/es/vc-select/Select';
import type { RouteLocationRaw } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import type { TableColumnProps as ATableColumnProps } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import type { ComputedRef } from 'vue';
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface';

export type ValidationRules = Record<string, Rule | Rule[]>;

export type EntityID = number;
export type ProductRegistryID = string;

export type JsonParser<T, D = Recordable> = (json: D) => T;

export type DateFormat = Dayjs;

export type SortDirection = 'asc' | 'desc';

export interface DefaultModule<T = Recordable> {
  readonly default: T
}

export interface DateRange<T = DateFormat> {
  from: T
  to: T
}

export interface PaginationParams {
  page?: number
  perPage?: number
}
export interface FetchAllParam {
  all?: 1
}
export type PaginationFilter = PaginationParams & FetchAllParam;

export interface Sort<T extends string> {
  sort?: T
  sortBy?: SortDirection
}

export interface TableColumnProps extends ATableColumnProps {
  dataIndex: DataIndex
}

export interface TableAction<T = any> {
  title: string
  to?: RouteLocationRaw | ((record: T) => RouteLocationRaw)
  click?: (record: T) => void
  condition?: (record: T) => boolean
}

export interface LoadingService {
  startLoading: () => void
  stopLoading: () => void
  isLoading: ComputedRef<boolean>
}

export type DrawerSize = 'sm' | 'md' | 'lg';

export type LabelInValueMixed = Nullable<LabelInValueType | EntityID>;

export type Coordinates = [number, number];

export interface StaticStatus {
  readonly id: number
  readonly title: string
  readonly color?: string
}

