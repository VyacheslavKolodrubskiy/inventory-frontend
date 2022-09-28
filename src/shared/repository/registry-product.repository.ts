import type { UrlParam } from '@qlt2020/frutils';
import { RegistryProduct } from '@/shared/models/registry-product.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import type { RegistryProductFilters } from '@/shared/dto/registry-product.dto';
import { Movement } from '@/modules/movement/movement.model';

export class RegistryProductRepository {
  static async fetch(params?: RegistryProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'warehouse-product',
      params,
    });

    return ResponseParser.parsePaginationList(response, RegistryProduct.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `warehouse-product/${id}`,
    });

    return ResponseParser.parse(response, RegistryProduct.fromJson);
  }

  static async readProductHistory(uuid: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `warehouse-product/history/${uuid}`,
    });

    return ResponseParser.parseList(response, Movement.fromJson);
  }
}
