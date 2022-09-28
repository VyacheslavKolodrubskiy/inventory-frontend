import { UserStatus } from '@/shared/enums/status.enum';
import type { EntityID, JsonParser, StaticStatus } from '@/types';
import { Role } from '@/shared/models/role.model';

import { Parse } from '@/shared/network/parse';

export abstract class BaseUser {
  abstract id: EntityID;
  abstract name: string;
  abstract email: string;
  abstract phone: string;
  abstract status: StaticStatus;
}

export class User extends BaseUser {
  constructor(
    public id: EntityID,
    public name: string,
    public email: string,
    public phone: string,
    public status: StaticStatus,
    public role: Role,
  ) { super(); }

  static fromJson: JsonParser<User> = (json) => {
    return new User(
      Parse.number(json.id),
      Parse.string(json.name),
      Parse.string(json.email),
      Parse.phone(json.phone),
      Parse.requiredStatus(UserStatus, json.status?.id),
      Parse.requiredObject(json.role, Role.fromJson),
    );
  };
}
