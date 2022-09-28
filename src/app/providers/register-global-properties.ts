import type { App } from 'vue';
import { canUse } from '@/shared/utils/permissions';
import { Format } from '@/shared/utils/format';

export function registerGlobalProperties(app: App) {
  app.config.globalProperties.$canUse = canUse;
  app.config.globalProperties.$format = Format;
}
