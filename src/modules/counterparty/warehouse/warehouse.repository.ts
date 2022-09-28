import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateWarehouseDto, WarehouseFilters } from './warehouse.dto';
import { Warehouse } from './warehouse.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

export class WarehouseRepository {
  static async fetch(params?: WarehouseFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'warehouse',
      params,
    });

    return ResponseParser.parsePaginationList(response, Warehouse.fromJson);
  }

  static async create(data: UpdateWarehouseDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'warehouse',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `warehouse/${id}`,
    });

    return ResponseParser.parse(response, Warehouse.fromJson);
  }

  static async update(id: UrlParam, data: UpdateWarehouseDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `warehouse/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
