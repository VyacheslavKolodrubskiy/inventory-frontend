import { BaseMovement } from '@/shared/models/movement.model';
import { Parse } from '@/shared/network/parse';
import type { DateFormat, EntityID, JsonParser, StaticStatus } from '@/types';
import { DocumentStatus } from '@/shared/enums/status.enum';
import { BaseEntity } from '@/shared/models/base.model';
import { User } from '@/shared/models/user.model';
import { ProductStatusCount } from '@/shared/models/product-status-count';

export class Relocation extends BaseMovement {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public createdDate: DateFormat,
    public status: StaticStatus,
    public author: User,
    public responsibleEmployee: User,
    public liabilityUser: User,

    public productStatus: ProductStatusCount,
    public fromWarehouse: BaseEntity,
    public toWarehouse: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<Relocation> = (json) => {
    return new Relocation(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.comment),
      Parse.requiredDate(json.createdAt),
      Parse.requiredStatus(DocumentStatus, json.status.id),
      Parse.requiredObject(json.author, User.fromJson),
      Parse.requiredObject(json.responsibleUser, User.fromJson),
      Parse.requiredObject(json.liabilityUser, User.fromJson),

      Parse.requiredObject(json.docItemStatusCount, ProductStatusCount.fromJson),
      Parse.requiredObject(json.sentWarehouse, BaseEntity.fromJson),
      Parse.requiredObject(json.warehouseTo, BaseEntity.fromJson),
    );
  };
}
