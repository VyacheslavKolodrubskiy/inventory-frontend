import type { Nullable } from '@qlt2020/frutils';
import type { ValidateStatus } from 'ant-design-vue/es/form/FormItem';
import type { Product } from '@/modules/catalog/product/product.model';
import type { LabelInValueMixed } from '@/types';
import { i18n } from '@/i18n';

export interface TransferProduct extends Product {
  key: string
  count: Nullable<number>
  disabled: boolean
  validateStatus: ValidateStatus
  warehousePlaceSelected: LabelInValueMixed
}

export function getRowSelection({
  disabled,
  selectedKeys,
  onItemSelectAll,
  onItemSelect,
  filteredItems,
}: Record<string, any>) {
  return {
    getCheckboxProps: (item: Record<string, string | boolean>) => {
      return { disabled: disabled || item.disabled };
    },
    onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
      // If some item is undefined, then filter is applied. Explicitly select/deselect eachItem
      if (selectedRows.some(row => !row)) {
        filteredItems
          .forEach(({ key }: { key: string }) => {
            onItemSelect(key, selected);
          });
      } else {
        const treeSelectedKeys = selectedRows
          .filter(item => !item?.disabled)
          .map(({ key }) => key);
        onItemSelectAll(treeSelectedKeys, selected);
      }
    },
    onSelect({ key }: Record<string, string>, selected: boolean) {
      onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
  };
}

export function prepareForTransfer(items: Product[]): TransferProduct[] {
  return items.map((item) => {
    return {
      ...item,
      count: null,
      disabled: false,
      validateStatus: '',
      warehousePlaceSelected: null,
      key: `${item.id}`,
    };
  });
}

export const leftColumns = [
  {
    dataIndex: 'title',
    title: i18n.t('common.name'),
  },
  {
    dataIndex: ['unit', 'title'],
    title: i18n.t('common.unitShort'),
  },
  {
    title: i18n.t('common.markable'),
    dataIndex: 'markable',
  },
];
export const rightColumns = [
  {
    dataIndex: 'title',
    title: i18n.t('common.name'),
  },
  {
    title: i18n.t('common.markable'),
    dataIndex: 'markable',
  },
  {
    dataIndex: 'warehousePlaceSelected',
    title: i18n.t('common.warehousePlace'),
    width: 220,
  },
  {
    dataIndex: 'count',
    title: i18n.t('common.count'),
    width: 150,
  },
];
