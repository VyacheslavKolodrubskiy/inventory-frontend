import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';

export class Country {
  constructor(
    public id: EntityID,
    public title: string,
    public slug: string,
  ) {}

  static fromJson: JsonParser<Country> = (json) => {
    return new Country(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.slug),
    );
  };
}
