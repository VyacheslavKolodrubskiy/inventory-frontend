import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { ProductCategory } from '@/modules/catalog/product-category/product-category.model';
import type { ProductCategoryFilters, UpdateProductCategoryDto } from '@/modules/catalog/product-category/product-category.dto';

export class ProductCategoryRepository {
  static async fetch(params?: ProductCategoryFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'product-category',
      params,
    });

    return ResponseParser.parsePaginationList(response, ProductCategory.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-category/${id}`,
    });

    return ResponseParser.parse(response, ProductCategory.fromJson);
  }

  static async create(data: UpdateProductCategoryDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'product-category',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateProductCategoryDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-category/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
