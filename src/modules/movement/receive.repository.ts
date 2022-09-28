import type { UrlParam } from '@qlt2020/frutils';
import { Receive } from '@/modules/movement/receive.model';
import { MovementProduct } from '@/shared/models/registry-product.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

import type { CreateReceiveImportDto, CreateReceiveManualyDto, ReceiveProductFilters, RemoveReceiveProductDto, UpdateReceiveDto, UpdateReceiveProductDto } from '@/modules/movement/receive.dto';

export class ReceiveRepository {
  static async create(data: CreateReceiveManualyDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'product-move/receiving',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/receiving/${id}`,
    });

    return ResponseParser.parse(response, Receive.fromJson);
  }

  static async update(id: UrlParam, data: UpdateReceiveDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/receiving/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async import(data: CreateReceiveImportDto) {
    const response = await http.formRequest({
      method: HttpMethod.POST,
      url: 'product-move/receiving/excel',
      data,
    });

    return ResponseParser.parseShallow(response);
  }

  static async fetchProducts(id: UrlParam, params?: ReceiveProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/receiving/${id}/products`,
      params,
    });

    return ResponseParser.parsePaginationList(response, MovementProduct.fromJson);
  }

  static async updateProducts(id: UrlParam, data: UpdateReceiveProductDto[]) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/receiving/${id}/products`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async deleteProducts(id: UrlParam, data: RemoveReceiveProductDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/receiving/${id}/products/delete`,
      data: {
        data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async close(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `product-move/receiving/${id}/close`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async sendToTerminal(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `product-move/receiving/${id}/send-to-terminal`,
    });

    return ResponseParser.parseShallow(response);
  }
}
