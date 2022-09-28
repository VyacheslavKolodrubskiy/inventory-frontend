import { toArray } from '@qlt2020/frutils';
import type { UrlParam } from '@qlt2020/frutils';
import { Manager } from './manager.model';
import type { ManagerFilters, UpdateManagerDto } from './manager.dto';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

export class ManagerRepository {
  static async fetch(params?: ManagerFilters) {
    if (params?.warehouseId)
      params.warehouseId = toArray(params.warehouseId);

    const response = await http.request({
      method: HttpMethod.GET,
      url: 'manager',
      params,
    });

    return ResponseParser.parsePaginationList(response, Manager.fromJson);
  }

  static async create(data: UpdateManagerDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'manager',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `manager/${id}`,
    });

    return ResponseParser.parse(response, Manager.fromJson);
  }

  static async update(id: UrlParam, data: UpdateManagerDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `manager/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
