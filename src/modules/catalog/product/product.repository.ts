import type { UrlParam } from '@qlt2020/frutils';
import type { UploadFile } from 'ant-design-vue';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { Product } from '@/modules/catalog/product/product.model';
import type { DeleteProductDto, ProductFilters, UpdateProductDto } from '@/modules/catalog/product/product.dto';

export class ProductRepository {
  static async fetch(params?: ProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'product',
      params,
    });

    return ResponseParser.parsePaginationList(response, Product.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product/${id}`,
    });

    return ResponseParser.parse(response, Product.fromJson);
  }

  static async create(data: UpdateProductDto) {
    const response = await http.formRequest({
      method: HttpMethod.POST,
      url: 'product',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateProductDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async addFile(id: UrlParam, data: UploadFile) {
    const response = await http.formRequest({
      method: HttpMethod.POST,
      url: `product/${id}/images`,
      data: {
        file: data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async deleteFile(params: DeleteProductDto) {
    const response = await http.request({
      method: HttpMethod.DELETE,
      url: `product/${params.productId}/images/${params.imageId}`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async import(file: File) {
    const response = await http.formRequest({
      method: HttpMethod.POST,
      url: '/product-import',
      data: {
        excelFile: file,
      },
    });

    return ResponseParser.parseShallow(response);
  }
}
