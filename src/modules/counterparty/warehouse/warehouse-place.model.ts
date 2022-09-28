import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import { BaseEntity } from '@/shared/models/base.model';

export class WarehousePlace {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public warehouse?: BaseEntity,
  ) {}

  static fromJson: JsonParser<WarehousePlace> = (json) => {
    return new WarehousePlace(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.description),
      Parse.object(json.warehouse, BaseEntity.fromJson),
    );
  };
}

