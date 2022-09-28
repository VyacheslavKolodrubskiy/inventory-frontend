import type { UrlParam } from '@qlt2020/frutils';
import type { WarehouseFilters } from './warehouse.dto';
import { WarehousePlace } from './warehouse-place.model';
import type { UpdateWarehousePlaceDto } from './warehouse-place.dto';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

export class WarehousePlaceRepository {
  static async fetch(params?: WarehouseFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'warehouse-place',
      params,
    });

    return ResponseParser.parsePaginationList(response, WarehousePlace.fromJson);
  }

  static async create(data: UpdateWarehousePlaceDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'warehouse-place',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `warehouse-place/${id}`,
    });

    return ResponseParser.parse(response, WarehousePlace.fromJson);
  }

  static async update(id: UrlParam, data: UpdateWarehousePlaceDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `warehouse-place/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
