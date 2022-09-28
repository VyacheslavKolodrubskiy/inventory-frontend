import type { UrlParam } from '@qlt2020/frutils';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { Country } from '@/shared/models/country.model';
import type { CountryFilters, UpdateCountryDto } from '@/modules/catalog/country/country.dto';

export class CountryRepository {
  static async fetch(params?: CountryFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'country',
      params,
    });

    return ResponseParser.parsePaginationList(response, Country.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `country/${id}`,
    });

    return ResponseParser.parse(response, Country.fromJson);
  }

  static async create(data: UpdateCountryDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'country',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async update(id: UrlParam, data: UpdateCountryDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `country/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
