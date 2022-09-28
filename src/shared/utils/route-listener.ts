/**
 * Used to monitor routing changes to change the status of menus and tabs.
 * There is no need to monitor the route, because the route status change is
 * affected by the page rendering time, which will be slow
 */

import { mitt } from '@qlt2020/frutils';
import type { RouteLocationNormalized } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';
import { useAuthStoreOutside } from '@/shared/store/auth.store';
import { getRawRoute } from '@/shared/utils/router-utils';

interface Events {
  [x: symbol | string]: RouteLocationNormalized
}

const emitter = mitt<Events>();

const key = Symbol('route-tabs');

let lastChangedRoute: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  if (
    !lastChangeRoute.name
    || [PageName.REDIRECT, PageName.LOGOUT].includes(lastChangeRoute.name as PageName)
    || lastChangeRoute.matched.some(m => m.name === 'ErrorPage')
    || !useAuthStoreOutside().isLoggedIn
  )
    return;

  const rawRoute = getRawRoute(lastChangeRoute);

  emitter.emit(key, rawRoute);
  lastChangedRoute = rawRoute;
}

export function createRouteChangeListener(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, callback);
  immediate && lastChangedRoute && callback(lastChangedRoute);
}

export function removeRouteChangeListener() {
  emitter.all.clear();
}
