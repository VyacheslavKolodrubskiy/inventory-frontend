// @unocss-include
import DownloadOutlined from '@ant-design/icons-vue/lib/icons/DownloadOutlined';
import ExportOutlined from '@ant-design/icons-vue/lib/icons/ExportOutlined';
import UploadOutlined from '@ant-design/icons-vue/lib/icons/UploadOutlined';
import BuildOutlined from '@ant-design/icons-vue/lib/icons/BuildOutlined';
import BarcodeOutlined from '@ant-design/icons-vue/lib/icons/BarcodeOutlined';
import { MovementType } from '@/shared/enums/status.enum';

export const enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export const Role = {
  Admin: { id: 1, title: 'common.admin', color: 'purple' },
  Manager: { id: 2, title: 'common.manager', color: 'blue' },
} as const;

export type PermissionRoleId = typeof Role[keyof typeof Role]['id'];
export type PermissionRole = keyof typeof Role;

export const enum PageName {
  BASE_LAYOUT = 'Default',
  BASE_HOME = 'Statistics',
  BASE_LOGIN = 'Login',

  LOGOUT = 'Logout',
  REDIRECT = 'Redirect',
  ERROR_500 = 'Error500',
}

export const DocumentType = {
  'receive': { icon: DownloadOutlined, title: 'common.receive', class: 'text-success-500', movementTypeId: MovementType.Receive.id },
  'relocation': { icon: ExportOutlined, title: 'common.movement', class: 'text-warning-500', movementTypeId: MovementType.Relocation.id },
  'write-off': { icon: UploadOutlined, title: 'common.writeOff', class: 'text-error-500', movementTypeId: MovementType.WriteOff.id },
  'inventory': { icon: BuildOutlined, title: 'common.inventory', class: 'text-blue-500', movementTypeId: null },
  'marking': { icon: BarcodeOutlined, title: 'common.marking', class: 'text-magenta-500', movementTypeId: null },
} as const;
