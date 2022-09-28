import { defineStore } from 'pinia';
import type { Profile } from '@/shared/models/profile.model';
import type { Role } from '@/shared/models/role.model';

export interface UserState {
  current: Profile
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    current: {} as Profile,
  }),

  getters: {
    currentRole(): Role {
      return this.current.role;
    },
  },
  actions: {
    setCurrentUser(user: Profile | null) {
      this.current = user || ({} as Profile);
    },
  },
});
