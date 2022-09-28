import type { UrlParam } from '@qlt2020/frutils';
import type { CounterpartyInfoFilters, UpdateCounterpartyInfoDto } from './counterparty-info.dto';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { CounterpartyInfo } from '@/modules/counterparty/counterparty-info/counterparty-info.model';

export class CounterpartyInfoRepository {
  static async fetch(params?: CounterpartyInfoFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'counterparty',
      params,
    });

    return ResponseParser.parsePaginationList(response, CounterpartyInfo.fromJson);
  }

  static async create(data: UpdateCounterpartyInfoDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'counterparty',
      data,
    });

    return ResponseParser.parse(response);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `counterparty/${id}`,
    });

    return ResponseParser.parse(response, CounterpartyInfo.fromJson);
  }

  static async update(id: UrlParam, data: UpdateCounterpartyInfoDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `counterparty/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }
}
