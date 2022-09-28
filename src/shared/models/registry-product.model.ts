import { DocumentProductStatus, ProductMarkingStatus } from '../enums/status.enum';
import { BaseImage } from './image.model';
import { User } from '@/shared/models/user.model';
import { Receive } from '@/modules/movement/receive.model';
import { BaseEntity } from '@/shared/models/base.model';
import { ProductCategory } from '@/shared/models/product-category.model';
import { BaseProduct } from '@/shared/models/product.model';
import { Parse } from '@/shared/network/parse';
import type { EntityID, JsonParser, ProductRegistryID, StaticStatus } from '@/types';
import { Unit } from '@/shared/models/unit.model';

export class MovementProduct extends BaseProduct {
  constructor(
    // Original product fields
    public originalId: EntityID,
    public title: string,
    public description: string,
    public category: ProductCategory,
    public unit: Unit,

    // Movement product fields
    public id: EntityID,
    public uuid: ProductRegistryID,
    public isMarked: boolean,
    public markable: boolean,
    public amount: number,
    public status: StaticStatus,
    public warehousePlace?: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<MovementProduct> = (json) => {
    return new MovementProduct(
      // Original product fields
      Parse.number(json.product.id),
      Parse.string(json.product.title),
      Parse.string(json.product.description),
      Parse.requiredObject(json.product.category, ProductCategory.fromJson),
      Parse.requiredObject(json.product.unit, Unit.fromJson),

      // Movement product fields
      Parse.requiredNumber(json.id),
      Parse.string(json.uuid),
      Parse.boolean(json.markStatus.id === ProductMarkingStatus.Marked.id),
      Parse.boolean(json.product.markable),
      Parse.number(json.amount),
      Parse.requiredStatus(DocumentProductStatus, json.status.id),
      Parse.object(json.warehousePlace, BaseEntity.fromJson),
    );
  };
}
export class MarkingProduct extends BaseProduct {
  constructor(
    public originalId: EntityID,
    public title: string,
    public description: string,
    public category: ProductCategory,
    public unit: Unit,

    public id: EntityID,
    public uuid: ProductRegistryID,
    public isMarked: boolean,
    public markable: boolean,
    public amount: number,
    public status: StaticStatus,
    public warehousePlace?: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<MarkingProduct> = (json) => {
    return new MarkingProduct(
      Parse.number(json.warehouseProduct.product.id),
      Parse.string(json.warehouseProduct.product.title),
      Parse.string(json.warehouseProduct.product.description),
      Parse.requiredObject(json.warehouseProduct.product.category, ProductCategory.fromJson),
      Parse.requiredObject(json.warehouseProduct.product.unit, Unit.fromJson),

      Parse.requiredNumber(json.id),
      Parse.string(json.warehouseProduct.id),
      Parse.boolean(json.warehouseProduct.markStatus.id === ProductMarkingStatus.Marked.id),
      Parse.boolean(json.warehouseProduct.product.markable),
      Parse.number(json.warehouseProduct.amount),
      Parse.requiredStatus(DocumentProductStatus, json.status.id),
      Parse.object(json.warehouseProduct.warehousePlace, BaseEntity.fromJson),
    );
  };
}

export class InventoryProduct extends BaseProduct {
  constructor(
    // Original product fields
    public originalId: EntityID,
    public title: string,
    public description: string,
    public category: ProductCategory,
    public unit: Unit,

    // Movement product fields
    public id: EntityID,
    public uuid: ProductRegistryID,
    public isMarked: boolean,
    public amount: number,
    public status: StaticStatus,
    public warehousePlace?: BaseEntity,
  ) { super(); }

  static fromJson: JsonParser<InventoryProduct> = (json) => {
    return new InventoryProduct(
      // Original product fields
      Parse.number(json.warehouseProduct.product.id),
      Parse.string(json.warehouseProduct.product.title),
      Parse.string(json.warehouseProduct.product.description),
      Parse.requiredObject(json.warehouseProduct.product.category, ProductCategory.fromJson),
      Parse.requiredObject(json.warehouseProduct.product.unit, Unit.fromJson),

      // Movement product fields
      Parse.requiredNumber(json.id),
      Parse.string(json.warehouseProduct.id),
      Parse.boolean(json.warehouseProduct.markStatus.id === ProductMarkingStatus.Marked.id),
      Parse.number(json.warehouseProduct.amount),
      Parse.requiredStatus(DocumentProductStatus, json.status.id),
      Parse.object(json.warehouseProduct.warehousePlace, BaseEntity.fromJson),
    );
  };
}

export class RegistryProduct extends BaseProduct {
  constructor(
    // Original product fields
    public originalId: EntityID,
    public title: string,
    public description: string,
    public category: ProductCategory,
    public unit: Unit,
    public images: BaseImage[],

    // Registry product fields
    public id: ProductRegistryID,
    public isMarked: boolean,
    public markable: boolean,
    public amount: number,
    public receiveData: Receive,
    public warehouse: BaseEntity,
    public warehousePlace?: BaseEntity,
    public liabilityUser?: User, // TODO this field is temporarily optional, set it to required when possible
    public barcode?: string,
    public tid?: string,
  ) { super(); }

  static fromJson: JsonParser<RegistryProduct> = (json) => {
    return new RegistryProduct(
      // Original product fields
      Parse.number(json.product.id),
      Parse.string(json.product.title),
      Parse.string(json.product.description),
      Parse.requiredObject(json.product.category, ProductCategory.fromJson),
      Parse.requiredObject(json.product.unit, Unit.fromJson),
      Parse.objectList(json.product.images, BaseImage.fromJson),

      // Registry product fields
      Parse.string(json.id),
      Parse.boolean(json.markStatus.id === ProductMarkingStatus.Marked.id),
      Parse.boolean(json.product.markable),
      Parse.number(json.amount),
      Parse.requiredObject(json.productMove, Receive.fromJson),
      Parse.requiredObject(json.warehouse, BaseEntity.fromJson),
      Parse.object(json.warehousePlace, BaseEntity.fromJson),
      Parse.object(json.liabilityUser, User.fromJson),
      Parse.string(json.warehouseProductBarcode?.barcodeHash),
      Parse.string(json.warehouseProductBarcode?.tid),
    );
  };
}
