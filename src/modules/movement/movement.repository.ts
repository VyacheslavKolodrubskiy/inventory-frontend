import { Movement } from '@/modules/movement/movement.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import type { MovementFilters } from '@/modules/movement/movement.dto';

export class MovementRepository {
  static async fetch(params?: MovementFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'product-move',
      params,
    });

    return ResponseParser.parsePaginationList(response, Movement.fromJson);
  }
}
