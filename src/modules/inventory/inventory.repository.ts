import type { UrlParam } from '@qlt2020/frutils';
import type { CreateInventoryDto, InventoryFilters, InventoryProductFilters, RemoveInventoryProductDto, UpdateInventoryDto } from './inventory.dto';
import { Inventory } from './inventory.model';
import { InventoryProduct } from '@/shared/models/registry-product.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

export class InventoryRepository {
  static async fetch(params?: InventoryFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'inventory',
      params,
    });

    return ResponseParser.parsePaginationList(response, Inventory.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `inventory/${id}`,
    });

    return ResponseParser.parse(response, Inventory.fromJson);
  }

  static async update(id: UrlParam, data: UpdateInventoryDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `inventory/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async fetchProducts(id: UrlParam, params?: InventoryProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `inventory/${id}/products`,
      params,
    });

    return ResponseParser.parsePaginationList(response, InventoryProduct.fromJson);
  }

  static async create(data: CreateInventoryDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'inventory',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async deleteProducts(id: UrlParam, data: RemoveInventoryProductDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `inventory/${id}/products/delete`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async close(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `inventory/${id}/close`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async sendToTerminal(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `inventory/${id}/send-to-terminal`,
    });

    return ResponseParser.parseShallow(response);
  }
}
