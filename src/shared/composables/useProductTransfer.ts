import type { EmitType, Fn, Nullable } from '@qlt2020/frutils';
import { hasString, sleep } from '@qlt2020/frutils';

import type { ValidateStatus } from 'ant-design-vue/es/form/FormItem';
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import type { InventoryProductFilters } from '@/modules/inventory/inventory.dto';
import { useLoading } from '@/shared/composables/useLoading';
import { Executor } from '@/shared/network/executor';
import { RegistryProductRepository } from '@/shared/repository/registry-product.repository';
import { UnitType } from '@/shared/enums/status.enum';
import { useResettableState } from '@/shared/composables/useResettableState';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { DEFAULT_PER_PAGE, TABLE_MAX_UPDATE_RATE } from '@/shared/config/constants';
import type { RegistryProduct } from '@/shared/models/registry-product.model';
import { createLabelInValue, getAntdPagination } from '@/shared/utils/utils';
import type { LabelInValueMixed } from '@/types';

export interface TransferProduct extends RegistryProduct {
  key: string
  disabled: boolean
  validateStatus: ValidateStatus
  warehousePlaceSelected: LabelInValueMixed
  count: Nullable<number>
}

function getRowSelection({
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

export const TRANSFER_HEIGHT = 450;

interface UseProductTransferOptions {
  initialWarehouseId: Nullable<number | string>
  preselectWarehousePlace?: boolean
}

export function useProductTransfer(emit: EmitType<'updateRecords'>, options: UseProductTransferOptions) {
  const {
    initialWarehouseId,
    preselectWarehousePlace = false,
  } = options;

  const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
    productTitle: '',
    productCategoryId: null,
    warehouseId: initialWarehouseId,
    warehousePlaceId: null,
    markId: undefined,
    markable: undefined,
  }));

  const { form: staticFilters, resetForm: resetStaticFilters } = useResettableState(() => ({
    title: '',
    categoryId: null,
    warehousePlaceId: null,
    markId: undefined,
    markable: undefined,
  }));

  const state = reactive({
    products: [] as TransferProduct[],
    targetKeys: [] as string[],
    targetRecords: [] as TransferProduct[],
    targetSelected: [] as string[],
    filteredStaticItems: [] as TransferProduct[],
    isMultipleChangeModalVisible: false,
    isHelpModalVisible: false,
    currentStaticPage: 1,
  });

  const pagination = usePagination();
  const loadingState = useLoading();

  const remotePagination = computed(() => {
    if (!pagination || pagination.lastPage === 1)
      return false;

    return {
      ...getAntdPagination(pagination),
      showSizeChanger: false,
      showQuickJumper: true,
      showLessItems: true,
    };
  });

  function prepareForTransfer(items: RegistryProduct[]): TransferProduct[] {
    return items.map((item) => {
      return {
        ...item,
        disabled: false,
        validateStatus: '',
        count: null,
        warehousePlaceSelected: preselectWarehousePlace && item.warehousePlace ? createLabelInValue(item.warehousePlace.title, item.warehousePlace.id) : null,
        key: item.id,
      };
    });
  }

  function fetchProducts(params?: InventoryProductFilters) {
    Executor.run({
      request: RegistryProductRepository.fetch(params),
      pagination,
      loadingState,
      onResult(data) {
        state.products = prepareForTransfer(data.list);
      },
    });
  }

  function onCountChange(record: TransferProduct) {
    record.validateStatus = '';
  }

  function onUpdateCurrent(value: number) {
    state.currentStaticPage = value;
  }

  const staticPagination = computed(() => {
    if (state.targetRecords.length <= DEFAULT_PER_PAGE)
      return false;

    return {
      'pageSize': DEFAULT_PER_PAGE,
      'current': state.currentStaticPage,
      'onUpdate:current': onUpdateCurrent,
    };
  });

  const recordsQuantityByPage = computed(() => {
    const totalRecords = state.targetRecords.length;
    const totalPages = Math.ceil(totalRecords / DEFAULT_PER_PAGE);
    const isLastPage = state.currentStaticPage === totalPages;

    if (!totalRecords)
      return 0;

    return isLastPage
      ? (totalRecords % DEFAULT_PER_PAGE) || DEFAULT_PER_PAGE
      : DEFAULT_PER_PAGE;
  });

  const productsAccordingTargets = computed(() => {
    return state.products.map((product) => {
      return {
        ...product,
        disabled: state.targetKeys.includes(product.key),
      };
    });
  });

  function setNewTargetRecords(nextTargetKeys: string[]) {
    state.targetRecords = state.targetRecords
      .filter((product) => {
        if (nextTargetKeys.includes(product.key))
          return true;

        // clear data in records that have been moved to left column
        if (!preselectWarehousePlace)
          product.warehousePlaceSelected = null;

        product.count = null;
        product.validateStatus = '';
        return false;
      });

    submitStaticFilters();

    emit('updateRecords', state.targetRecords);
  }

  function moveToLeft(onItemSelectAll: Fn) {
    const nextTargetKeys = state.targetKeys.filter(key => !state.targetSelected.includes(key));

    setNewTargetRecords(nextTargetKeys);
    state.targetKeys = nextTargetKeys;

    onItemSelectAll([], false);
  }

  function onSelectChangeTransfer(sourceSelectedKeys: string[], targetSelectedKeys: string[]) {
    state.targetSelected = targetSelectedKeys;
  }

  const onChangeTable = (onItemSelectAll: Fn, tablePagination: TablePaginationConfig) => {
    if (tablePagination.current)
      pagination.page = tablePagination.current;

    submitFilter(onItemSelectAll);
  };

  function onChangeTransfer(nextTargetKeys: string[]) {
    nextTargetKeys
      .filter((key) => {
        const notExistInTarget = !state.targetRecords.some(rec => rec.key === key);
        const existInProducts = state.products.some(product => product.key === key);
        return notExistInTarget && existInProducts;
      })
      .forEach((key) => {
        const foundProduct = state.products.find(product => product.key === key)!;
        state.targetRecords.push(foundProduct);
      });

    setNewTargetRecords(nextTargetKeys);
  }

  const canReloadProducts = ref(true);

  async function reloadProducts() {
    canReloadProducts.value = false;
    submitFilter();

    await sleep(TABLE_MAX_UPDATE_RATE);

    canReloadProducts.value = true;
  }

  function showMultipleChangeModal() {
    state.isMultipleChangeModalVisible = true;
  }

  function onMultipleChange(warehousePlace: LabelInValueMixed) {
    state.targetRecords
      .filter(product => state.targetSelected.includes(product.key))
      .forEach((product) => {
        product.warehousePlaceSelected = warehousePlace;
      });

    state.isMultipleChangeModalVisible = false;
  }

  function validateTargetRecords() {
    let hasError = false;
    let firstErrorIndex: number | null = null;

    state.targetRecords.forEach((record, index) => {
      if (
        (!record.count || record.count <= 0 || record.count > record.amount)
        && record.unit.type.id === UnitType.Uncountable.id
      ) {
        record.validateStatus = 'error';
        hasError = true;

        // Remember index of the first error, to switch to page this record lay on
        if (firstErrorIndex == null)
          firstErrorIndex = index;
      }
    });

    if (firstErrorIndex != null)
      state.currentStaticPage = Math.ceil((firstErrorIndex + 1) / DEFAULT_PER_PAGE);

    return hasError;
  }

  function submitFilter(onItemSelectAll?: Fn) {
    onItemSelectAll?.([], false);
    fetchProducts({ ...getPaginationParams(pagination), ...filters });
  }

  function resetFilter(onItemSelectAll: Fn) {
    resetFilters();
    submitFilter(onItemSelectAll);
  }

  function submitStaticFilters() {
    state.filteredStaticItems = state.targetRecords.filter((item: TransferProduct) => {
      const warehousePlaceSelected = item.warehousePlaceSelected as LabelInValueType;
      const warehousePlaceId = preselectWarehousePlace ? warehousePlaceSelected?.value : item.warehousePlace?.id;

      const hasTitle = hasString(item.title, staticFilters.title);
      const hasCategory = staticFilters.categoryId ? item.category.id === staticFilters.categoryId : true;
      const hasWarehousePlaceSelected = staticFilters.warehousePlaceId ? warehousePlaceId === staticFilters.warehousePlaceId : true;
      const isMarked = staticFilters.markId == null || staticFilters.markId === +item.isMarked;
      const isMarkable = staticFilters.markable == null || staticFilters.markable === +item.markable;

      return hasTitle && hasCategory && hasWarehousePlaceSelected && isMarked && isMarkable;
    });
  }

  function resetStaticFilter() {
    resetStaticFilters();
    resetFilteredStaticItems();
  }

  function resetFilteredStaticItems() {
    state.filteredStaticItems = state.targetRecords;
  }

  return {
    state,
    filters,
    staticFilters,
    getRowSelection,
    onCountChange,
    submitFilter,
    resetFilter,
    submitStaticFilters,
    resetStaticFilter,
    validateTargetRecords,
    moveToLeft,
    onChangeTable,
    fetchProducts,
    onSelectChangeTransfer,
    showMultipleChangeModal,
    onMultipleChange,
    onChangeTransfer,
    reloadProducts,
    canReloadProducts,
    remotePagination,
    staticPagination,
    loadingState,
    pagination,
    recordsQuantityByPage,
    productsAccordingTargets,
  };
}
