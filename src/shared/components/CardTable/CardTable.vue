<template>
  <ACard ref="rootComponent" class="card-table">
    <div class="card-table__header">
      <ARow class="items-center">
        <ACol v-if="$slots.title">
          <slot name="title" />
        </ACol>
        <ACol class="ml-auto">
          <slot name="extra" />

          <ADivider
            v-if="$slots.extra"
            class="mx-3"
            type="vertical"
          />

          <ASpace :size="4">
            <CardTableActionReload @reload="$emit('reload')" />

            <CardTableActionSize v-model="size" />

            <CardTableActionSettings
              v-model:checked-keys="checkedColumnKeys"
              v-model:sorted-keys="sortedColumnKeys"
              :original-keys="originalKeys"
              :sorted-columns="sortedColumns"
              @reset="onReset"
            />

            <CardTableActionFullscreen :element="rootComponent" />
          </ASpace>
        </ACol>
      </ARow>
    </div>

    <slot />
  </ACard>
</template>

<script lang="ts" setup>
import type { VueInstance } from '@vueuse/core';
import type { SizeType } from 'ant-design-vue/es/config-provider/context';
import CardTableActionReload from '@/shared/components/CardTable/CardTableActionReload.vue';
import type { TableColumnProps } from '@/types';
import CardTableActionFullscreen from '@/shared/components/CardTable/CardTableActionFullscreen.vue';
import CardTableActionSize from '@/shared/components/CardTable/CardTableActionSize.vue';
import CardTableActionSettings from '@/shared/components/CardTable/CardTableActionSettings.vue';

const props = defineProps<{
  columns: TableColumnProps[]
}>();

const emit = defineEmits(['reload']);
const size = ref<NonNullable<SizeType>>('middle');

const originalKeys = computed(() => props.columns.map(column => column.dataIndex.toString()));

const checkedColumnKeys = ref<string[]>([...originalKeys.value]);
const sortedColumnKeys = ref<string[]>([...originalKeys.value]);

const sortedColumns = computed(() => {
  return props.columns.slice().sort((columnA, columnB) => {
    const indexA = sortedColumnKeys.value.indexOf(columnA.dataIndex.toString());
    const indexB = sortedColumnKeys.value.indexOf(columnB.dataIndex.toString());

    if (indexA === -1 || indexB === -1)
      return 0;

    return indexA - indexB;
  });
});

const filteredAndSortedColumns = computed(() => {
  return sortedColumns.value.filter((column) => {
    return checkedColumnKeys.value.includes(column.dataIndex.toString());
  });
});

function onReset() {
  checkedColumnKeys.value = [...originalKeys.value];
  sortedColumnKeys.value = [...originalKeys.value];
}

provide('size', size);
provide('filteredAndSortedColumns', filteredAndSortedColumns);

const rootComponent = ref<VueInstance | null>(null);
</script>
