<template>
  <ADropdown placement="bottomRight" :trigger="['click']">
    <a class="page-header__action max-w-55" @click.prevent>
      <div class="page-header__user">
        <div class="page-header__user-name">{{ currentUser.name }}</div>
        <div class="page-header__user-subname">{{ currentRole.name }}</div>
      </div>
      <ABadge
        class="leading-tight"
        dot
        :status="isOnline ? 'success' : 'error'"
      >
        <AAvatar class="page-header__user-avatar" shape="square">
          {{ getInitials(currentUser.name) }}
        </AAvatar>
      </ABadge>
    </a>

    <template #overlay>
      <AMenu>
        <AMenuItem>
          <template #icon>
            <SettingOutlined />
          </template>
          <RouterLink :to="{ name: 'Profile' }">
            {{ $t('common.profile') }}
          </RouterLink>
        </AMenuItem>
        <AMenuItem danger @click="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          {{ $t('action.quit') }}
        </AMenuItem>

        <AMenuDivider />

        <li class="px-3 py-1">
          <ATypographyText class="text-xs" type="secondary">
            {{ $t('common.version') }} {{ APP_VERSION }}
          </ATypographyText>
        </li>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script lang="ts" setup>
import { getInitials } from '@qlt2020/frutils';
import { useOnline } from '@vueuse/core';
import { PageName } from '@/shared/enums/common.enum';
import { APP_VERSION } from '@/shared/config/constants';
import { useUserStore } from '@/shared/store/user.store';
import { useAppStore } from '@/shared/store/app.store';

const isOnline = useOnline();

const router = useRouter();

const userStore = useUserStore();
const appStore = useAppStore();

const currentUser = computed(() => userStore.current);
const currentRole = computed(() => userStore.currentRole);

function logout() {
  router.push({ name: PageName.LOGOUT });
}
</script>
