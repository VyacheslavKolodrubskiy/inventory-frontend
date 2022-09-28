import type { ProductCategory } from '@/shared/models/product-category.model';
import type { Unit } from '@/shared/models/unit.model';
import type { EntityID, ProductRegistryID } from '@/types';

export abstract class BaseProduct {
  abstract id: EntityID | ProductRegistryID;
  abstract title: string;
  abstract description: string;
  abstract category: ProductCategory;
  abstract unit: Unit;
}
