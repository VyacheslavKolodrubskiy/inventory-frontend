import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { Unit } from '@/shared/models/unit.model';
import type { UnitFilters, UpdateUnitDto } from '@/modules/catalog/unit/unit.dto';

export class UnitRepository {
  static async fetch(params?: UnitFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'unit',
      params,
    });

    return ResponseParser.parsePaginationList(response, Unit.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `unit/${id}`,
    });

    return ResponseParser.parse(response, Unit.fromJson);
  }

  static async create(data: UpdateUnitDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'unit',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateUnitDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `unit/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
