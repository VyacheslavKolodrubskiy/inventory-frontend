import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import { Region } from '@/modules/catalog/region/region.model';

export class City {
  constructor(
    public id: EntityID,
    public title: string,
    public slug: string,
    public region: Region,
  ) {}

  static fromJson: JsonParser<City> = (json) => {
    return new City(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.slug),
      Parse.requiredObject(json.region, Region.fromJson),
    );
  };
}

