<template>
  <AList
    :data-source="dataSource"
    :pagination="getPagination"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>

    <template v-if="pagination" #footer>
      <i18n-t keypath="common.listDataShowed" tag="span">
        <template #dataLength>
          {{ getDataLength }}
        </template>
        <template #total>
          <strong>{{ pagination?.total }}</strong>
        </template>
      </i18n-t>
    </template>
  </AList>
</template>

<script setup lang="ts">
import type { ListProps } from 'ant-design-vue';
import type { UsePaginationReturn } from '@/shared/composables/usePagination';

const props = defineProps<{
  pagination?: UsePaginationReturn
  dataSource: NonNullable<ListProps['dataSource']>
}>();

const getDataLength = computed(() => props.dataSource?.length || 0);

const getPagination = computed(() => {
  if (!props.pagination || props.pagination.lastPage === 1)
    return false;

  return {
    pageSize: props.pagination.perPage,
    total: props.pagination.total,
    current: props.pagination.page,
  };
});
</script>
