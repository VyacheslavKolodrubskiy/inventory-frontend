import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import { removeNullable } from '@qlt2020/frutils';
import { HttpMethod, PageName } from '@/shared/enums/common.enum';
import { router } from '@/app/router';

import { useAuthStore } from '@/shared/store/auth.store';
import { useLocaleStore } from '@/shared/store/locale.store';
import { getAppEnv } from '@/shared/config/env';

const enum StatusCode {
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<AxiosRequestHeaders> = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

class Http {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers,
    });

    this._initializeInterceptors();
  }

  private _handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const authStore = useAuthStore();
    const localeStore = useLocaleStore();

    if (authStore.token != null && config.headers)
      config.headers.Authorization = `Bearer ${authStore.token}`;

    if (config.headers)
      config.headers['Content-Language'] = localeStore.locale;

    return config;
  }

  private _handleRequestError = (error: AxiosError) => Promise.reject(error);
  private _handleResponse = (response: AxiosResponse) => response;
  private _handleResponseError(error: AxiosError) {
    const { response } = error;

    if (response)
      this.handleError(response.status);

    return Promise.reject(error);
  }

  private _initializeInterceptors() {
    this.instance.interceptors.request.use(this._handleRequest, this._handleRequestError);
    this.instance.interceptors.response.use(this._handleResponse, this._handleResponseError.bind(this));
  }

  // Handle global app errors
  protected handleError(status: AxiosResponse['status']) {
    switch (status) {
      case StatusCode.InternalServerError: {
        break;
      }
      case StatusCode.Forbidden: {
        break;
      }
      case StatusCode.Unauthorized: {
        const authStore = useAuthStore();
        authStore.logout();
        if (router.currentRoute.value.fullPath === `/${PageName.BASE_LOGIN}`)
          router.push({ name: PageName.BASE_LOGIN });
        else
          router.push({ name: PageName.BASE_LOGIN, query: { redirect: router.currentRoute.value.fullPath } });

        break;
      }
      case StatusCode.TooManyRequests: {
        break;
      }
    }
  }

  private _baseRequest(config: AxiosRequestConfig) {
    if (config.params)
      config.params = removeNullable(config.params, true);

    config.paramsSerializer = {
      indexes: false,
      dots: true,
    };

    config.formSerializer = {
      indexes: false,
    };

    return this.instance.request(config);
  }

  request(config: AxiosRequestConfig) {
    return this._baseRequest(config);
  }

  formRequest(config: AxiosRequestConfig) {
    let { method, data } = config;

    config.headers = { 'Content-Type': 'multipart/form-data' };

    if (method !== HttpMethod.POST) {
      data = { _method: method, ...data };
      method = HttpMethod.POST;
    }

    return this._baseRequest({ ...config, method, data });
  }
}
const { VITE_GLOB_API_URL } = getAppEnv();
export const http = new Http(VITE_GLOB_API_URL);
