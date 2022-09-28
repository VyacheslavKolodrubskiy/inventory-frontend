import { CounterpartyInfo } from '../counterparty-info/counterparty-info.model';
import { WarehousePlace } from './warehouse-place.model';
import type { Coordinates, EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import { City } from '@/modules/catalog/city/city.model';
import { BaseEntity } from '@/shared/models/base.model';

export class Warehouse extends BaseEntity {
  constructor(
    public id: EntityID,
    public title: string,
    public description: string,
    public counterparty: CounterpartyInfo,
    public location: Coordinates,
    public warehousePlaces: WarehousePlace[],
    public city: City,
    public image: string,
  ) { super(id, title); }

  static fromJson: JsonParser<Warehouse> = (json) => {
    return new Warehouse(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.description),
      Parse.requiredObject(json.counterparty, CounterpartyInfo.fromJson),
      Parse.coordinates(json.location),
      Parse.objectList(json.warehousePlaces, WarehousePlace.fromJson),
      Parse.requiredObject(json.city, City.fromJson),
      Parse.string(json.image),
    );
  };
}

