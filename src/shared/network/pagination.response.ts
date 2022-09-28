import { isArray, isObject } from '@qlt2020/frutils';
import type { JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';
import type { ResponsePaginationList } from '@/shared/network/response-parser';
import { ParseError } from '@/shared/utils/errors';

export class Pagination<T> {
  constructor(
    public list: T[],
    public perPage: number,
    public lastPage: number,
    public total: number,
  ) {}

  static fromJson<T>(responseData: ResponsePaginationList, itemParser: JsonParser<T>) {
    const content = responseData.data;
    const meta = responseData.meta;

    if (!isArray(content))
      throw new ParseError('Data array', content);

    if (!isObject(meta))
      throw new ParseError('Meta object', meta);

    return new Pagination<T>(
      content.map(it => itemParser(it)),
      Parse.number(meta.perPage),
      Parse.number(meta.lastPage, { defaultValue: 1 }),
      Parse.number(meta.total, { defaultValue: 1 }),
    );
  }

  static getConverter<T>(itemParser: JsonParser<T>): JsonParser<Pagination<T>, ResponsePaginationList> {
    return responseData => Pagination.fromJson(responseData, itemParser);
  }
}
