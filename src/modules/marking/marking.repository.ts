import type { UrlParam } from '@qlt2020/frutils';
import type { CreateMarkingDto, CreateMarkingProductDto, MarkingFilters, MarkingProductFilters, UpdateMarkingDto, UpdateMarkingProductDto } from './marking.dto';
import { Marking } from './marking.model';
import { http } from '@/shared/network/http';
import { ResponseParser } from '@/shared/network/response-parser';
import { HttpMethod } from '@/shared/enums/common.enum';
import { MarkingProduct } from '@/shared/models/registry-product.model';
import { BaseEntity } from '@/shared/models/base.model';
import type { EntityID } from '@/types';

export class MarkingRepository {
  static async fetch(params?: MarkingFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'marking',
      params,
    });

    return ResponseParser.parsePaginationList(response, Marking.fromJson);
  }

  static async fetchProducts(id: UrlParam, params?: MarkingProductFilters) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `marking/${id}/products`,
      params,
    });

    return ResponseParser.parsePaginationList(response, MarkingProduct.fromJson);
  }

  static async create(data: CreateMarkingDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'marking',
      data,
    });

    return ResponseParser.parse(response, BaseEntity.fromJson);
  }

  static async read(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `marking/${id}`,
    });

    return ResponseParser.parse(response, Marking.fromJson);
  }

  static async update(id: UrlParam, data: UpdateMarkingDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `marking/${id}`,
      data,
    });

    return ResponseParser.parse(response);
  }

  static async createProducts(id: UrlParam, data: CreateMarkingProductDto[]) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: `marking/${id}/products`,
      data,
    });

    return ResponseParser.parseShallow(response);
  }

  static async updateProducts(id: UrlParam, data: UpdateMarkingProductDto[]) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `marking/${id}/products`,
      data,
    });

    return ResponseParser.parseShallow(response);
  }

  static async deleteProducts(id: UrlParam, data: EntityID[]) {
    const response = await http.request({
      method: HttpMethod.DELETE,
      url: `marking/${id}/products`,
      params: {
        products: data,
      },
    });

    return ResponseParser.parseShallow(response);
  }

  static async close(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: `marking/${id}/close`,
    });

    return ResponseParser.parseShallow(response);
  }

  static async sendToTerminal(id: UrlParam) {
    const response = await http.request({
      method: HttpMethod.GET,
      url: `marking/${id}/send-to-terminal`,
    });

    return ResponseParser.parseShallow(response);
  }
}
