import { isTruthy } from '@qlt2020/frutils';
import { camelCase } from 'lodash-es';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { MODAL_URL_PREFIX } from '@/shared/config/constants';

type ModalType = 'add' | 'view' | 'edit';

export function getModalPath(moduleName: string, type: ModalType = 'view') {
  const path = [
    MODAL_URL_PREFIX,
    moduleName,
  ];
  if (type === 'add') {
    path.push('add');
  } else {
    path.push(`:${camelCase(moduleName)}Id`);
    type === 'edit' && path.push('edit');
  }
  return path.filter(isTruthy).join('/');
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route)
    return route;

  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
        meta: item.meta,
        name: item.name,
        path: item.path,
      }))
      : undefined) as RouteRecordNormalized[],
  };
}
