import type { AxiosResponse } from 'axios';
import type { Nullable, Recordable } from '@qlt2020/frutils';
import { isArray, isObject, objectValues } from '@qlt2020/frutils';

import type { JsonParser } from '@/types';
import { HttpUtils } from '@/shared/network/http-utils';
import type { OperationResult } from '@/shared/network/operation-result';
import { OperationError, OperationSuccess } from '@/shared/network/operation-result';
import { Pagination } from '@/shared/network/pagination.response';
import { ParseError } from '@/shared/utils/errors';
import { i18n } from '@/i18n';

interface ResponseData<T = Recordable> {
  data: T
}
interface ResponseList<T = Recordable> {
  data: T[]
}
interface ResponseMeta {
  perPage: number
  lastPage: number
  total: number
}
export interface ResponsePaginationList extends ResponseList {
  meta: ResponseMeta
}
interface ResponseErrors {
  data: string
  errors: Nullable<Recordable<string[]>>
}
export type Converter<T, D = Recordable> = (json: D) => T;

function assertRootDataObject(data: AxiosResponse['data']): asserts data is Record<any, any> {
  if (!isObject(data))
    throw new ParseError('Root data object', data);
}

export abstract class ResponseParser {
  static parseShallow<T>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T> {
    return this._baseParse(response, (responseData: Recordable) => {
      return itemParser ? itemParser(responseData) : responseData as T;
    });
  }

  static parse<T>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T> {
    assertRootDataObject(response.data);

    return this._baseParse(response, (responseData: ResponseData<T>) => {
      const content = responseData.data;

      if (!isObject(content))
        throw new ParseError('Data object', content);

      return itemParser ? itemParser(content) : content;
    });
  }

  static parseList<T extends Recordable<any>>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T[]> {
    assertRootDataObject(response.data);

    return this._baseParse(response, (responseData: ResponseList<T>) => {
      const content = responseData.data;

      if (!isArray(content))
        throw new ParseError('Data array', content);

      return itemParser ? content.map(it => itemParser(it)) : content;
    });
  }

  static parsePaginationList<T>(response: AxiosResponse, itemParser: JsonParser<T>): OperationResult<Pagination<T>> {
    assertRootDataObject(response.data);

    return this._baseParse(response, Pagination.getConverter(itemParser));
  }

  static _baseParse<T, R>(response: AxiosResponse<R>, converter: Converter<T, R>): OperationResult<T> {
    const { data } = response;

    if (HttpUtils.isSuccessful(response))
      return new OperationSuccess<T>(converter(data), response as unknown as AxiosResponse<T>);
    else
      return this.parseErrorResponse(response);
  }

  static parseErrorResponse<T>(response: AxiosResponse) {
    const { data } = response as AxiosResponse<ResponseErrors>;
    let message = '';
    if (data) {
      if (data.errors)
        message = this._getErrorMessagesHtml(data.errors);
      else
        message = data.data;
    } else {
      message = i18n.t('common.noDataProperty');
    }

    return new OperationError<T>(message);
  }

  static _getErrorMessagesHtml(errors: Recordable<string[]>) {
    let errorsStr = '';
    let tmpErrors: string[] = [];

    tmpErrors = objectValues(errors).flat();

    tmpErrors.forEach((text) => {
      errorsStr += `<div>${text}</div>`;
    });

    return errorsStr;
  }
}
