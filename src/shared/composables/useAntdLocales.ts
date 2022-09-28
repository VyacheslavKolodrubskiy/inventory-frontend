import { objectKeys } from '@qlt2020/frutils';
import type { Locale as AntdLocale } from 'ant-design-vue/es/locale-provider';
import type { DefaultModule } from '@/types';
import { Locale } from '@/shared/config/locale-config';

const AntdLocaleModules = import.meta.glob('../../../node_modules/ant-design-vue/es/locale/(ru_RU|kk_KZ).js');
const antdLocalesMap = {
  [Locale.RU]: 'ru_RU',
  [Locale.KK]: 'kk_KZ',
};

function getAntdLocaleLazyModule(locale: Locale) {
  const foundLocale = objectKeys(AntdLocaleModules).find(path => path.includes(antdLocalesMap[locale]));
  return (foundLocale ? AntdLocaleModules[foundLocale] : AntdLocaleModules[0]) as () => Promise<DefaultModule<AntdLocale>>;
}

const antdLocale = ref<AntdLocale>();

const loadAntdLocale = async (newLocale: Locale) => {
  const getLocale = getAntdLocaleLazyModule(newLocale);

  const res = await getLocale();
  antdLocale.value = res.default;

  return res.default;
};

export function useAntdLocales() {
  return {
    antdLocale,
    loadAntdLocale,
  };
}
