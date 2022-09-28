import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { Region } from '@/modules/catalog/region/region.model';
import type { RegionFilters, UpdateRegionDto } from '@/modules/catalog/region/region.dto';

export class RegionRepository {
  static async fetch(params?: RegionFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'region',
      params,
    });

    return ResponseParser.parsePaginationList(response, Region.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `region/${id}`,
    });

    return ResponseParser.parse(response, Region.fromJson);
  }

  static async create(data: UpdateRegionDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'region',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateRegionDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `region/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
