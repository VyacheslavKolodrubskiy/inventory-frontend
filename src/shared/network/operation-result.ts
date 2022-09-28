import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { ResponseParser } from '@/shared/network/response-parser';
import { i18n } from '@/i18n';

export class OperationResult<T> {
  constructor(public data: T) {}

  isSuccessful(): this is OperationSuccess<T> {
    return this instanceof OperationSuccess;
  }

  isUnsuccessful(): this is OperationError<T> {
    return this instanceof OperationError;
  }

  static fromError<T>(error: unknown): OperationResult<T> {
    if (!(error instanceof AxiosError))
      throw error;

    const { response, request, message } = error;

    if (response && error.code !== AxiosError.ERR_NETWORK) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return ResponseParser.parseErrorResponse(response);
    }

    if (request) {
      // The request was made but no response was received
      // `request` is an instance of XMLHttpRequest in the browser
      return new OperationError(`${i18n.t('common.error500Description')} ${i18n.t('common.tryAgainLater')}`, error);
    }

    // Something happened in setting up the request that triggered an Error
    return new OperationError(message, error);
  }
}

export class OperationSuccess<T> extends OperationResult<T> {
  constructor(
    data: T,
    public response: AxiosResponse<T>,
  ) {
    super(data);
  }
}

export class OperationError<T> extends OperationResult<T> {
  constructor(
    public message: string,
    public error?: unknown,
  ) {
    super({} as T);
  }
}
