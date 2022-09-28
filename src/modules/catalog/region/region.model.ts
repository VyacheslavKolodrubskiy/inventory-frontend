import type { EntityID, JsonParser } from '@/types';
import { Country } from '@/shared/models/country.model';
import { Parse } from '@/shared/network/parse';

export class Region {
  constructor(
    public id: EntityID,
    public title: string,
    public country: Country,
  ) {}

  static fromJson: JsonParser<Region> = (json) => {
    return new Region(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.requiredObject(json.country, Country.fromJson),

    );
  };
}

