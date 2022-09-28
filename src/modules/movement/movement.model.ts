import { BaseMovement } from '@/shared/models/movement.model';
import { User } from '@/shared/models/user.model';
import { Parse } from '@/shared/network/parse';
import type { DateFormat, EntityID, JsonParser, StaticStatus } from '@/types';
import { DocumentStatus, MovementType, WriteOffType } from '@/shared/enums/status.enum';
import { BaseEntity } from '@/shared/models/base.model';

export class Movement extends BaseMovement {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public createdDate: DateFormat,
    public status: StaticStatus,
    public author: User,
    public responsibleEmployee: User,

    public type: StaticStatus,
    public writeOffType: StaticStatus,
    public productAmount: number,
    public fromWarehouse?: BaseEntity,
    public toWarehouse?: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<Movement> = (json) => {
    return new Movement(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.comment),
      Parse.requiredDate(json.createdAt),
      Parse.requiredStatus(DocumentStatus, json.status.id),
      Parse.requiredObject(json.author, User.fromJson),
      Parse.requiredObject(json.responsibleUser, User.fromJson),

      Parse.requiredStatus(MovementType, json.type.id),
      Parse.requiredStatus(WriteOffType, json.writeOffType.id),
      Parse.number(json.productsCount),
      Parse.object(json.warehouseFrom, BaseEntity.fromJson),
      Parse.object(json.warehouseTo, BaseEntity.fromJson),
    );
  };
}
