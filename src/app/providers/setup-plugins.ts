import Antd from 'ant-design-vue/es';
import Maska from 'maska';
import YmapPlugin from 'vue-yandex-maps';
import type { App } from 'vue';
import { Locale } from '@/shared/config/locale-config';
import { useLocaleStoreOutside } from '@/shared/store/locale.store';

const yMapLocaleMap = {
  [Locale.RU]: 'ru_RU',
  [Locale.KK]: 'kk_KZ',
};

export function setupPlugins(app: App) {
  const { locale } = useLocaleStoreOutside();

  app.use(Antd);

  app.use(Maska);

  app.use(YmapPlugin, {
    apiKey: '51d5362b-63f0-42fc-8335-9db54fe37efc',
    lang: yMapLocaleMap[locale],
    coordorder: 'latlong',
  });
}
