import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import { City } from '@/modules/catalog/city/city.model';
import { BaseEntity } from '@/shared/models/base.model';

export class CounterpartyInfo extends BaseEntity {
  constructor(
    public id: EntityID,
    public title: string,
    public bin: string,
    public address: string,
    public email: string,
    public phone: string,
    public alias: string,
    public logo: string,
    public city: City,
  ) { super(id, title); }

  static fromJson: JsonParser<CounterpartyInfo> = (json) => {
    return new CounterpartyInfo(
      Parse.requiredNumber(json.id),
      Parse.string(json.title),
      Parse.string(json.bin),
      Parse.string(json.address),
      Parse.string(json.email),
      Parse.phone(json.phone),
      Parse.string(json.alias),
      Parse.string(json.logo),
      Parse.requiredObject(json.city, City.fromJson),
    );
  };
}

