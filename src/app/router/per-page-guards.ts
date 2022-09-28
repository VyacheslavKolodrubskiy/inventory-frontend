import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

export function setFromRedirect(to: RouteLocationNormalized, from: RouteLocationNormalized): RouteLocationRaw | undefined {
  if (!to.query.redirect) {
    const route = { ...to, replace: true };

    route.query.redirect = from.fullPath;

    return route;
  }
}
