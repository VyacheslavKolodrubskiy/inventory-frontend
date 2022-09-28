import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import type { CityFilters, UpdateCityDto } from '@/modules/catalog/city/city.dto';
import { City } from '@/modules/catalog/city/city.model';
import { HttpMethod } from '@/shared/enums/common.enum';

export class CityRepository {
  static async fetch(params?: CityFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'city',
      params,
    });

    return ResponseParser.parsePaginationList(response, City.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `city/${id}`,
    });

    return ResponseParser.parse(response, City.fromJson);
  }

  static async create(data: UpdateCityDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'city',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateCityDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `city/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
