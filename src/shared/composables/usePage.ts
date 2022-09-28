import { isEmpty, last } from '@qlt2020/frutils';
import type { Router } from 'vue-router';
import { PageName } from '@/shared/enums/common.enum';

function withoutModals(router: Router) {
  const matched = router.currentRoute.value.matched;
  return matched.filter(route => !route.path.includes('/m/'));
}

export function useGo() {
  const router = useRouter();

  function goToModalParent() {
    router.push({ path: last(withoutModals(router)).path });
  }

  function goToModalEdit() {
    const routeName = router.currentRoute.value.name as string;

    const splitted = routeName.split('.');
    splitted.splice(splitted.length - 1, 1, 'Edit');
    router.push({ name: splitted.join('.') });
  }

  return {
    goToModalParent,
    goToModalEdit,
  };
}
/**
 * Refresh the page
 */
export function useRedo() {
  const { replace, currentRoute } = useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);

  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === PageName.REDIRECT) {
        resolve(false);
        return;
      }
      if (name && isEmpty(params)) {
        params._redirect_type = 'name';
        params.path = String(name);
      } else {
        params._redirect_type = 'path';
        params.path = fullPath;
      }
      replace({ name: PageName.REDIRECT, params, query }).then(() => resolve(true));
    });
  }
  return redo;
}
