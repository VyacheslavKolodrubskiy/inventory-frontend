import { Parse } from '../network/parse';
import { BaseEntity } from './base.model';
import { BaseUser } from './user.model';
import type { EntityID, JsonParser, StaticStatus } from '@/types';
import { UserStatus } from '@/shared/enums/status.enum';
import { Role } from '@/shared/models/role.model';

export class Profile extends BaseUser {
  constructor(
    public id: EntityID,
    public name: string,
    public email: string,
    public phone: string,
    public status: StaticStatus,
    public role: Role,
    public counterparty?: BaseEntity,
    public warehouse?: BaseEntity[],
  ) { super(); }

  static fromJson: JsonParser<Profile> = (json) => {
    return new Profile(
      Parse.number(json.id),
      Parse.string(json.name),
      Parse.string(json.email),
      Parse.phone(json.phone),
      Parse.requiredStatus(UserStatus, json.status.id),
      Parse.requiredObject(json.role, Role.fromJson),
      Parse.object(json.counterparty, BaseEntity.fromJson),
      Parse.objectList(json.warehouse, BaseEntity.fromJson),
    );
  };
}
