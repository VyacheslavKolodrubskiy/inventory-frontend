import type { GlobalComponents as AntdGlobal } from 'ant-design-vue/typings/global';
import type { canUse } from '@/shared/utils/permissions';
import type { Format } from '@/shared/utils/format';
import type { PermissionRole } from '@/shared/enums/common.enum';

declare module 'vue-router' {
  interface RouteMeta {
    onlyLoggedOut?: boolean
    title?: string
    breadcrumbName?: string
    permissions?: PermissionRole[]
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $canUse: typeof canUse
    $format: typeof Format
  }
  interface GlobalComponents extends AntdGlobal {}
}

export interface GlobEnvConfig {
  VITE_GLOB_APP_TITLE: string
  VITE_GLOB_API_URL: string
  VITE_GLOB_APP_SHORT_NAME: string
}
