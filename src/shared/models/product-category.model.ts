import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';

export class ProductCategory {
  constructor(
    public id: EntityID,
    public title: string,
  ) {}

  static fromJson: JsonParser<ProductCategory> = (json) => {
    return new ProductCategory(
      Parse.number(json.id),
      Parse.string(json.title),
    );
  };
}
