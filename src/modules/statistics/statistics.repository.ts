import type { CommonStatisticsFilters, DetailedStatisticsFilters } from './statistics.dto';
import { CommonStatistics, DetailedStatistics, DocumentStatistics, WarehouseStatistics } from './statistics.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';

export class StatisticsRepository {
  static async fetchByCounterparty(params?: CommonStatisticsFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'statistics/by-counterparties',
      params,
    });

    return ResponseParser.parseList(response, CommonStatistics.fromJson);
  }

  static async fetchDetailed(params?: DetailedStatisticsFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'statistics/markable-products',
      params,
    });

    return ResponseParser.parse(response, DetailedStatistics.fromJson);
  }

  static async fetchWarehouseProducts(params?: DetailedStatisticsFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'statistics/warehouse-products',
      params,
    });

    return ResponseParser.parseList(response, WarehouseStatistics.fromJson);
  }

  static async fetchLatestDocuments(params?: DetailedStatisticsFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'statistics/latest-docs',
      params,
    });

    return ResponseParser.parseList(response, DocumentStatistics.fromJson);
  }
}
