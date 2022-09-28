import type { LabelInValueType } from 'ant-design-vue/es/vc-select/Select';
import screenfull from 'screenfull';
import { isObject } from '@qlt2020/frutils';
import type { UploadFile } from 'ant-design-vue';
import { DocumentType } from '../enums/status.enum';
import type { BaseImage } from '../models/image.model';
import type { UsePaginationReturn } from '@/shared/composables/usePagination';
import type { LabelInValueMixed } from '@/types';
import type { Movement } from '@/modules/movement/movement.model';
import type { DocumentStatistics } from '@/modules/statistics/statistics.model';

export function toggleFullscreen(element: HTMLElement) {
  if (screenfull.isEnabled)
    screenfull.toggle(element);
}

export function createLabelInValue(label?: string, value?: number): LabelInValueType | null {
  if (!label || !value)
    return null;
  return { label, value };
}

export function createFileList(images: BaseImage[]): UploadFile[] {
  return images.map(el => ({
    uid: el.id.toString(),
    name: el.url,
    status: 'done',
    url: el.url,
  }));
}

export function getLabelInValueId(labelValue: LabelInValueMixed) {
  if (isObject(labelValue))
    return labelValue.value as number;

  return labelValue;
}

export function getRouteThePage(document: DocumentStatistics | Movement, pageType: string, mainRoute = 'Movement') {
  if (document.type.id === DocumentType.Receive.id)
    return { name: `${mainRoute}.Receive.${pageType}`, params: { receiveId: document.id } };

  if (document.type.id === DocumentType.Relocation.id)
    return { name: `${mainRoute}.Relocation.${pageType}`, params: { relocationId: document.id } };

  if (document.type.id === DocumentType.WriteOff.id)
    return { name: `${mainRoute}.WriteOff.${pageType}`, params: { writeOffId: document.id } };

  if (document.type.id === DocumentType.Marking.id)
    return { name: `${mainRoute}.Marking.${pageType}`, params: { markingId: document.id } };

  return { name: `${mainRoute}.Inventory.${pageType}`, params: { inventoryId: document.id } };
}

export function getAntdPagination(pagination: UsePaginationReturn) {
  return {
    pageSize: pagination.perPage,
    total: pagination.total,
    current: pagination.page,
  };
}
