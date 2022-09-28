import { objectValues } from '@qlt2020/frutils';
import type { JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import type { PermissionRoleId } from '@/shared/enums/common.enum';
import { Role as RoleEnum } from '@/shared/enums/common.enum';

export class Role {
  constructor(
    public id: PermissionRoleId,
    public name: string,
  ) {}

  static fromJson: JsonParser<Role> = (json) => {
    return new Role(
      Parse.requiredSortOfNumber(json.id, objectValues(RoleEnum).map(roleValue => roleValue.id)) as PermissionRoleId,
      Parse.string(json.name),
    );
  };
}
