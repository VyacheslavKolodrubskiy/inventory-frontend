import { Parse } from '@/shared/network/parse';
import type { DateFormat, EntityID, JsonParser, StaticStatus } from '@/types';
import { BaseEntity } from '@/shared/models/base.model';
import { DocumentStatus, DocumentType } from '@/shared/enums/status.enum';
export class CommonStatistics {
  constructor(
    public markedProductsCount: number,
    public productsCount: number,
    public warehousesCount: number,
    public counterparty: BaseEntity,
  ) {}

  static fromJson: JsonParser<CommonStatistics> = (json) => {
    return new CommonStatistics(
      Parse.number(json.count_marked_products),
      Parse.number(json.count_products),
      Parse.number(json.count_warehouses),
      Parse.requiredObject(json.counterparty, BaseEntity.fromJson),
    );
  };
}

export class DetailedStatistics {
  constructor(
    public totalProducts: number,
    public totalMarkableProducts: number,
    public totalWithBarcode: number,
    public totalWithBarcodePercentage: number,
    public totalWithoutBarcode: number,
    public totalWithoutBarcodePercentage: number,
    public totalMarkedProducts: number,
    public totalMarkedProductsPercentage: number,
    public totalUnmarkedProducts: number,
    public totalUnmarkedProductsPercentage: number,
    public totalCountableProducts: number,
    public totalCountableProductsPercentage: number,
    public totalUncountableProducts: number,
    public totalUncountableProductsPercentage: number,
  ) {}

  static fromJson: JsonParser<DetailedStatistics> = (json) => {
    return new DetailedStatistics(
      Parse.number(json.total_products),
      Parse.number(json.total_to_markable_products),
      Parse.number(json.total_with_barcode),
      Parse.number(json.total_with_barcode_percentage),
      Parse.number(json.total_without_barcode),
      Parse.number(json.total_without_barcode_percentage),
      Parse.number(json.total_marked_products),
      Parse.number(json.total_marked_products_percentage),
      Parse.number(json.total_un_marked_products),
      Parse.number(json.total_un_marked_products_percentage),
      Parse.number(json.total_countable_products),
      Parse.number(json.total_countable_products_percentage),
      Parse.number(json.total_uncountable_products),
      Parse.number(json.total_uncountable_products_percentage),
    );
  };
}

export class WarehouseStatistics {
  constructor(
    public percentage: number,
    public total: number,
    public warehouseId: number,
    public warehouseName: string,
  ) {}

  static fromJson: JsonParser<WarehouseStatistics> = (json) => {
    return new WarehouseStatistics(
      Parse.number(json.percentage),
      Parse.number(json.total),
      Parse.number(json.warehouse_id),
      Parse.string(json.warehouse_name),
    );
  };
}

export class DocumentStatistics {
  constructor(
    public id: EntityID,
    public title: string,
    public createdDate: DateFormat,
    public status: StaticStatus,
    public responsibleUserName: string,

    public type: StaticStatus,
    public productAmount: number,
    public fromWarehouse?: BaseEntity,
    public toWarehouse?: BaseEntity,
  ) {}

  static fromJson: JsonParser<DocumentStatistics> = (json) => {
    return new DocumentStatistics(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.requiredDate(json.createdAt),
      Parse.requiredStatus(DocumentStatus, json.status.id),
      Parse.string(json.respUser.name),

      Parse.requiredStatus(DocumentType, json.type.id),
      Parse.number(json.productsCount),
      Parse.object(json.warehouseFrom, BaseEntity.fromJson),
      Parse.object(json.warehouseTo, BaseEntity.fromJson),
    );
  };
}
