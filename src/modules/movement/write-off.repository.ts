import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { MovementProduct } from '@/shared/models/registry-product.model';
import type { CreateWriteOffDto, RemoveWriteOffProductDto, UpdateWriteOffDto, UpdateWriteOffProductDto, WriteOffProductFilters } from '@/modules/movement/write-off.dto';
import { WriteOff } from '@/modules/movement/write-off.model';

export class WriteOffRepository {
  static async create(data: CreateWriteOffDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'product-move/write-off',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/write-off/${id}`,
    });

    return ResponseParser.parse(response, WriteOff.fromJson);
  }

  static async update(id: UrlParam, data: UpdateWriteOffDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/write-off/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async fetchProducts(id: UrlParam, params?: WriteOffProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/write-off/${id}/products`,
      params,
    });

    return ResponseParser.parsePaginationList(response, MovementProduct.fromJson);
  }

  static async updateProducts(id: UrlParam, data: UpdateWriteOffProductDto[]) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/write-off/${id}/products`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async deleteProducts(id: UrlParam, data: RemoveWriteOffProductDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/write-off/${id}/products/delete`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async close(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/write-off/${id}/close`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async sendToTerminal(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/write-off/${id}/send-to-terminal`,
    });

    return ResponseParser.parseShallow(response);
  }
}
