import type { Nullable } from '@qlt2020/frutils';
import { defineStore } from 'pinia';
import { removeRouteChangeListener } from '@/shared/utils/route-listener';
import { useUserStore } from '@/shared/store/user.store';
import { getStorageShortName } from '@/shared/config/env';
import { store } from '@/shared/store';

export interface AuthState {
  token: Nullable<string>
}

const STORE_ID = 'auth';

export const useAuthStore = defineStore(STORE_ID, {
  state: (): AuthState => ({
    token: null,
  }),
  getters: {
    isLoggedIn: state => !!state.token,
  },
  actions: {
    login(token: string) {
      this.token = token;
    },
    logout() {
      this.token = null;

      const userStore = useUserStore();
      userStore.setCurrentUser(null);
      removeRouteChangeListener();
    },
  },
  persist: {
    key: getStorageShortName(STORE_ID),
  },
});

// Need to be used outside the setup
export function useAuthStoreOutside() {
  return useAuthStore(store);
}
