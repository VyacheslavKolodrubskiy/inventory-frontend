import { getLocaleModules } from '../i18n-utils';

const messages = import.meta.globEager('./*ts');

export default {
  ...getLocaleModules(messages),
};
