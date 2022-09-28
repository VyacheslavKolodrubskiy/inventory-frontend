import { BaseEntity } from '@/shared/models/base.model';
import { BaseMovement } from '@/shared/models/movement.model';
import { Parse } from '@/shared/network/parse';
import type { DateFormat, EntityID, JsonParser, StaticStatus } from '@/types';
import { DocumentStatus } from '@/shared/enums/status.enum';
import { User } from '@/shared/models/user.model';
import { ProductStatusCount } from '@/shared/models/product-status-count';

export class Inventory extends BaseMovement {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public createdDate: DateFormat,
    public status: StaticStatus,
    public author: User,
    public responsibleEmployee: User,

    public productStatus: ProductStatusCount,
    public warehouse: BaseEntity,
    public warehousePlace?: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<Inventory> = (json) => {
    return new Inventory(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.description),
      Parse.requiredDate(json.createdAt),
      Parse.requiredStatus(DocumentStatus, json.status.id),
      Parse.requiredObject(json.author, User.fromJson),
      Parse.requiredObject(json.responsibleUser, User.fromJson),

      Parse.requiredObject(json.docItemStatusCount, ProductStatusCount.fromJson),
      Parse.requiredObject(json.warehouse, BaseEntity.fromJson),
      Parse.object(json.warehousePlace, BaseEntity.fromJson),
    );
  };
}
