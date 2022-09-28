import type { UrlParam } from '@qlt2020/frutils';
import { Relocation } from './relocation.model';
import type { CreateRelocationDto, RelocationProductFilters, RemoveRelocationProductDto, UpdateRelocationDto } from './relocation.dto';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { MovementProduct } from '@/shared/models/registry-product.model';

export class RelocationRepository {
  static async create(data: CreateRelocationDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'product-move/relocation',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async fetchProducts(id: UrlParam, params?: RelocationProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/relocation/${id}/products`,
      params,
    });

    return ResponseParser.parsePaginationList(response, MovementProduct.fromJson);
  }

  static async update(id: UrlParam, data: UpdateRelocationDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/relocation/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async deleteProducts(id: UrlParam, data: RemoveRelocationProductDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/relocation/${id}/products/delete`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async close(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/relocation/${id}/close`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async sendToTerminal(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/relocation/${id}/send-to-terminal`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/relocation/${id}`,
    });

    return ResponseParser.parse(response, Relocation.fromJson);
  }
}
