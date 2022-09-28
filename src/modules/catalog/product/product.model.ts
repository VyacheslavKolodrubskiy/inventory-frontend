import { BaseProduct } from '@/shared/models/product.model';
import type { DateFormat, EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import { ProductCategory } from '@/shared/models/product-category.model';
import { Unit } from '@/shared/models/unit.model';
import { BaseImage } from '@/shared/models/image.model';

export class Product extends BaseProduct {
  constructor(
    public id: EntityID,
    public createdDate: DateFormat,
    public title: string,
    public description: string,
    public category: ProductCategory,
    public unit: Unit,
    public markable: boolean,
    public articular: string,
    public images: BaseImage[],
  ) { super(); }

  static fromJson: JsonParser<Product> = (json) => {
    return new Product(
      Parse.number(json.id),
      Parse.requiredDate(json.createdAt),
      Parse.string(json.title),
      Parse.string(json.description),
      Parse.requiredObject(json.category, ProductCategory.fromJson),
      Parse.requiredObject(json.unit, Unit.fromJson),
      Parse.boolean(json.markable),
      Parse.string(json.articular),
      Parse.objectList(json.images, BaseImage.fromJson),
    );
  };
}
