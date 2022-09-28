import type { AxiosResponse } from 'axios';

export abstract class HttpUtils {
  static isSuccessful(response: AxiosResponse) {
    return response.status >= 200 && response.status < 300;
  }
}
