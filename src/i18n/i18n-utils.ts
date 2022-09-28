import type { Recordable } from '@qlt2020/frutils';
import { objectKeys } from '@qlt2020/frutils';

export function getLocaleModules(messages: Recordable) {
  const exportMessages: Recordable = {};

  objectKeys(messages).forEach((messageKey) => {
    exportMessages[messageKey.slice(2, (messageKey.length - 3))] = messages[messageKey].default;
  });

  return exportMessages;
}
