import { UserStatus } from '@/shared/enums/status.enum';
import type { EntityID, JsonParser, StaticStatus } from '@/types';
import { Parse } from '@/shared/network/parse';
import { BaseUser } from '@/shared/models/user.model';

export class Admin extends BaseUser {
  constructor(
    public id: EntityID,
    public name: string,
    public email: string,
    public phone: string,
    public status: StaticStatus,
  ) { super(); }

  static fromJson: JsonParser<Admin> = (json) => {
    return new Admin(
      Parse.number(json.id),
      Parse.string(json.name),
      Parse.string(json.email),
      Parse.phone(json.phone),
      Parse.requiredStatus(UserStatus, json.status.id),
    );
  };
}

