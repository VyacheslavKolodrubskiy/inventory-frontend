import { UserStatus } from '@/shared/enums/status.enum';
import type { EntityID, JsonParser, StaticStatus } from '@/types';

import { Parse } from '@/shared/network/parse';
import { BaseUser } from '@/shared/models/user.model';
import { BaseEntity } from '@/shared/models/base.model';

export class Manager extends BaseUser {
  constructor(
    public id: EntityID,
    public name: string,
    public email: string,
    public phone: string,
    public status: StaticStatus,
    public counterparty: BaseEntity,
    public warehouses: BaseEntity[],
  ) { super(); }

  static fromJson: JsonParser<Manager> = (json) => {
    return new Manager(
      Parse.number(json.id),
      Parse.string(json.name),
      Parse.string(json.email),
      Parse.phone(json.phone),
      Parse.requiredStatus(UserStatus, json.status.id),
      Parse.requiredObject(json.counterparty, BaseEntity.fromJson),
      Parse.objectList(json.warehouse, BaseEntity.fromJson),
    );
  };
}

