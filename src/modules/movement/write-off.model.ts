import { BaseMovement } from '@/shared/models/movement.model';
import { Parse } from '@/shared/network/parse';
import type { DateFormat, EntityID, JsonParser, StaticStatus } from '@/types';
import { DocumentStatus, WriteOffType } from '@/shared/enums/status.enum';
import { BaseEntity } from '@/shared/models/base.model';
import { User } from '@/shared/models/user.model';
import { ProductStatusCount } from '@/shared/models/product-status-count';

export class WriteOff extends BaseMovement {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public createdDate: DateFormat,
    public status: StaticStatus,
    public author: User,
    public responsibleEmployee: User,
    public writeOffType: StaticStatus,
    public inventoryId: number,

    public productStatus: ProductStatusCount,
    public fromWarehouse: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<WriteOff> = (json) => {
    return new WriteOff(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.comment),
      Parse.requiredDate(json.createdAt),
      Parse.requiredStatus(DocumentStatus, json.status.id),
      Parse.requiredObject(json.author, User.fromJson),
      Parse.requiredObject(json.responsibleUser, User.fromJson),
      Parse.requiredStatus(WriteOffType, json.writeOffType.id),
      Parse.number(json.inventoryId),

      Parse.requiredObject(json.docItemStatusCount, ProductStatusCount.fromJson),
      Parse.requiredObject(json.fromWarehouse, BaseEntity.fromJson),
    );
  };
}
