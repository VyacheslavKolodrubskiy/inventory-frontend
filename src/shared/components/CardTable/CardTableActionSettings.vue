<template>
  <ATooltip>
    <template #title>
      {{ $t('common.tableSettings') }}
    </template>

    <APopover
      overlay-class-name="popover-table-settings"
      placement="bottomRight"
      trigger="click"
    >
      <template #title>
        <ACheckbox
          v-model:checked="state.checkAll"
          :indeterminate="state.indeterminate"
          @change="onCheckAllChange"
        >
          {{ $t('action.selectAll') }}
        </ACheckbox>
        <AButton
          size="small"
          type="link"
          @click="$emit('reset')"
        >
          {{ $t('action.reset') }}
        </AButton>
      </template>

      <template #content>
        <ATree
          block-node
          checkable
          :checked-keys="checkedKeys"
          draggable
          :selectable="false"
          show-icon
          :tree-data="treeData"
          :virtual="false"
          @drop="changeKeyIndex"
          @update:checked-keys="onUpdateCheckedKeys"
        />
      </template>

      <AButton
        class="ant-btn-icon-only"
        type="text"
      >
        <SettingOutlined />
      </AButton>
    </APopover>
  </ATooltip>
</template>

<script lang="ts" setup>
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import type { Key } from 'ant-design-vue/es/vc-tree/interface';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree';
import { move } from '@qlt2020/frutils';
import type { TableColumnProps } from '@/types';

const props = defineProps<{
  sortedColumns: TableColumnProps[]
  checkedKeys: string[]
  sortedKeys: string[]
  originalKeys: string[]
}>();
const emit = defineEmits(['update:checkedKeys', 'update:sortedKeys', 'reset']);

const state = reactive({
  indeterminate: false,
  checkAll: false,
});

const treeData = computed(() => {
  return props.sortedColumns.map(column => ({
    title: column.title,
    key: column.dataIndex.toString(),
  }));
});

function onCheckAllChange(e: CheckboxChangeEvent) {
  emit('update:checkedKeys', e.target.checked ? props.originalKeys : [treeData.value[0].key]);
  state.indeterminate = !e.target.checked;
}

function onUpdateCheckedKeys(checkedKeys: Key[]) {
  if (!checkedKeys.length)
    return;

  emit('update:checkedKeys', checkedKeys);
}

watch(
  () => props.checkedKeys,
  (value) => {
    state.indeterminate = !!value.length && value.length < props.originalKeys.length;
    state.checkAll = value.length === props.originalKeys.length;
  },
  { immediate: true },
);

function changeKeyIndex(info: AntTreeNodeDropEvent) {
  const dragNodeKey = info.dragNode.key.toString();
  const newArray = [...props.sortedKeys];
  const foundIndex = newArray.indexOf(dragNodeKey);

  let dropPosition: number;
  if (info.dropToGap) {
    if (info.dropPosition === -1)
      dropPosition = 0;
    else
      dropPosition = foundIndex < info.dropPosition ? info.dropPosition - 1 : info.dropPosition;
  } else {
    dropPosition = foundIndex < info.dropPosition ? info.dropPosition + 1 : info.dropPosition;
  }

  if (foundIndex >= 0)
    move(newArray, foundIndex, dropPosition);

  emit('update:sortedKeys', newArray);
}
</script>
