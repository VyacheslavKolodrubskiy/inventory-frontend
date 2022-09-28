import { defineStore } from 'pinia';
import { isEqual, last, move } from '@qlt2020/frutils';
import { Format } from '@/shared/utils/format';
import { store } from '@/shared/store';

export const enum ErrorType {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}

export interface ErrorLogInfo {
  type: ErrorType
  name: string
  message: string
  url: string
  count?: number
  file?: string
  detail?: string
  stack?: string
  time?: string
}

export interface ErrorLogState {
  errorLog: ErrorLogInfo[]
}

export const useErrorLogStore = defineStore('error-log', {
  state: (): ErrorLogState => ({
    errorLog: [],
  }),
  getters: {
    getErrorLogCount(): number {
      return this.errorLog.length;
    },
  },
  actions: {
    addErrorBase(info: ErrorLogInfo) {
      const item = {
        ...info,
        time: Format.datetime(),
        count: 1,
      };

      this.errorLog = [item, ...this.errorLog];
    },
    addErrorLogInfo(info: ErrorLogInfo) {
      const lastError = last(this.errorLog);
      console.warn('New error added to log', info);

      if (!lastError)
        return this.addErrorBase(info);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { time, count, ...rawError } = lastError;
      if (!isEqual(info, rawError))
        return this.addErrorBase(info);

      lastError.count! += 1;
      lastError.time = Format.datetime();
      move(this.errorLog, this.errorLog.indexOf(lastError), 0);
    },
  },
});

// Need to be used outside the setup
export function useErrorLogStoreOutside() {
  return useErrorLogStore(store);
}
