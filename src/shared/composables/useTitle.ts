import { useLocaleStore } from '@/shared/store/locale.store';
import { getAppEnv } from '@/shared/config/env';
import { PageName } from '@/shared/enums/common.enum';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();
  const { VITE_GLOB_APP_TITLE } = getAppEnv();

  watch(
    [() => currentRoute.value.path, () => localeStore.locale],
    () => {
      const route = unref(currentRoute);

      if (route.name === PageName.REDIRECT)
        return;

      const title = route?.meta?.title;
      document.title = title ? `${t(title)} - ${VITE_GLOB_APP_TITLE}` : VITE_GLOB_APP_TITLE;
    },
    { immediate: true },
  );
}
