import { defineStore } from 'pinia';
import { getStorageShortName } from '@/shared/config/env';

export interface AppState {
  tabsList: string[]
}

const STORE_ID = 'route-tabs';

export const useRouteTabsStore = defineStore(STORE_ID, {
  state: (): AppState => ({
    tabsList: [],
  }),
  getters: {
  },
  actions: {
  },
  persist: {
    key: getStorageShortName(STORE_ID),
  },
});
