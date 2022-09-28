<template>
  <ATable
    :columns="filteredAndSortedColumns || columns"
    :data-source="dataSource"
    :pagination="getPagination"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'ant-table-row-striped' : undefined)"
    :row-key="rowKey"
    :scroll="isScrollable"
    :size="size"
    :transform-cell-text="transformCellText"
  >
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>

    <template v-if="pagination" #footer>
      <i18n-t
        keypath="common.listDataShowed"
        scope="global"
        tag="span"
      >
        <template #dataLength>
          {{ getDataLength }}
        </template>
        <template #total>
          <strong>{{ pagination?.total }}</strong>
        </template>
      </i18n-t>
    </template>
  </ATable>
</template>

<script setup lang="ts">
import { isArray } from '@qlt2020/frutils';
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { SizeType } from 'ant-design-vue/es/config-provider/context';
import type { Ref } from 'vue';
import { getAntdPagination } from '@/shared/utils/utils';
import type { UsePaginationReturn } from '@/shared/composables/usePagination';
import { useBreakpoints } from '@/shared/composables/useBreakpoints';
import type { TableColumnProps } from '@/types';

const props = withDefaults(defineProps<{
  pagination?: UsePaginationReturn
  dataSource: NonNullable<TableProps['dataSource']>
  columns: TableColumnProps[]
  rowKey?: string
}>(), {
  rowKey: 'id',
});

const size = inject<Ref<SizeType>>('size', ref('middle'));

/*
 * На самом деле из инжекта приходит ComputedRef
 * TS не может развернуть (unref) этот inject в шаблоне, если указать тип ComputedRef<TableColumnProps[]>
 */
const filteredAndSortedColumns = inject<TableColumnProps[] | null>('filteredAndSortedColumns', null);

const { isMobile } = useBreakpoints();

const getDataLength = computed(() => props.dataSource?.length || 0);

const isScrollable = computed(() => {
  if (!props.dataSource.length)
    return undefined;

  return { x: isMobile ? 1024 : 'true' };
});

const getPagination = computed(() => {
  if (!props.pagination || props.pagination.lastPage <= 1)
    return false;

  return {
    ...getAntdPagination(props.pagination),
    showSizeChanger: false,
    showQuickJumper: true,
    showLessItems: true,
  };
});

// Potential memory leak. This callback fires on cell mouseover
function transformCellText({ text }: any) {
  if (isArray(text))
    return text.length ? text : '—';

  return text;
}
</script>
