import { Permission, objectMap } from '@qlt2020/frutils';
import type { PermissionRole } from '@/shared/enums/common.enum';
import { useUserStore } from '@/shared/store/user.store';
import { Role } from '@/shared/enums/common.enum';

const permission = new Permission<PermissionRole>(
  objectMap(Role, (key, value) => [value.id, key]),
  () => useUserStore().currentRole.id,
);

export const canUse = permission.hasPermission.bind(permission);
