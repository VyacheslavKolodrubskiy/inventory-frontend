import type { Router } from 'vue-router';
import { setRouteChange } from '@/shared/utils/route-listener';
import { canUse } from '@/shared/utils/permissions';
import { PageName } from '@/shared/enums/common.enum';
import { Executor } from '@/shared/network/executor';
import { UserRepository } from '@/shared/repository/user.repository';
import { useUserStore } from '@/shared/store/user.store';
import { useAuthStoreOutside } from '@/shared/store/auth.store';
import { Logger } from '@/shared/utils/logger';
import { usePageLoading, useSecondaryLoading } from '@/shared/composables/useLoading';

const _logger = new Logger('Router', false);
const _guardsLogger = new Logger('Guard', false);
const secondaryLoading = useSecondaryLoading();
const pageLoading = usePageLoading();

function getCurrentUser() {
  const userStore = useUserStore();

  if (userStore.current.id)
    return Promise.resolve();

  return Executor.run({
    request: UserRepository.read(),
    loadingState: secondaryLoading,
    onResult(data) {
      userStore.setCurrentUser(data);
    },
    onError(err) {
      throw err;
    },
  });
}

// DON'T CHANGE THE ORDER OF CREATION
export function setupRouterGuards(router: Router) {
  createPageGuard(router);
  createProgressGuard(router);
  createMessageGuard(router);
  createPermissionGuard(router);
}

function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach((to) => {
    _logger.log(`%cGoing to %c${to.name as string}`, 'font-weight: bold', 'font-weight: bold; color: blue', to);
    _guardsLogger.log('(beforeEach) page guard. Set loaded:', !!loadedPageMap.get(to.path));
    // The page has already been loaded, it will be faster to open it again, you don’t need to do loading and other processing
    to.meta.loaded = !!loadedPageMap.get(to.path);

    // Notify about routing changes
    setRouteChange(to);
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
    _guardsLogger.log('(afterEach) page guard. Is loaded:', !!loadedPageMap.get(to.path));
  });
}

function createProgressGuard(router: Router) {
  router.beforeEach((to) => {
    _guardsLogger.log('(beforeEach) progress guard.', to.meta.loaded ? 'Page already loaded' : 'Page not loaded');
    if (to.meta.loaded)
      return;

    pageLoading.setPageLoading(true);
  });

  router.afterEach((to) => {
    _guardsLogger.log('(afterEach) progress guard.', to.meta.loaded ? 'Page already loaded' : 'Page not loaded');

    pageLoading.setPageLoading(false);
  });
}

/**
 * Close the message instance and destroy modal dialogs when the route is switched
 */
function createMessageGuard(router: Router) {
  router.beforeEach(() => {
    _guardsLogger.log('(beforeEach) message guard');
    Modal.destroyAll();
    notification.destroy();
  });
}

function createPermissionGuard(router: Router) {
  const authStore = useAuthStoreOutside();

  router.beforeEach(async (to) => {
    if ([PageName.ERROR_500, PageName.REDIRECT].includes(to.name as PageName))
      return;

    if (authStore.isLoggedIn) {
      _logger.log('User is logged in');

      if (to.meta.onlyLoggedOut) {
        _logger.log('This page available only for logged out user');

        return { name: PageName.BASE_HOME };
      }

      try {
        await getCurrentUser();
      } catch {
        return { name: PageName.ERROR_500, replace: true };
      }

      if (!canUse(to.meta.permissions) && !to.meta.public) {
        _logger.log('Access denied. No permission for this route');

        return { name: 'Error403', replace: true };
      }

      _logger.log(`Access granted. This route ${to.meta.public ? 'is public' : `available for: ${to.meta.permissions || 'all roles'}`}`);
      return;
    }

    _logger.log('User is logged out');

    if (!to.meta.public && !to.meta.onlyLoggedOut) {
      _logger.log('Access denied. Need authorization');

      return {
        name: PageName.BASE_LOGIN,
        query: { redirect: to.query.redirect || to.fullPath },
        replace: true,
      };
    }

    _logger.log('Access granted');
  });
}
