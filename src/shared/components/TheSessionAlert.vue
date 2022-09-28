<template>
  <AAlert
    v-if="show"
    banner
    show-icon
    type="warning"
  >
    <template #message>
      <i18n-t keypath="message.currentSessionWasChanged">
        <template #reload>
          <a type="link" @click.prevent="reload">{{ $t('common.reload') }}</a>
        </template>
      </i18n-t>
    </template>
  </AAlert>
</template>

<script lang="ts" setup>
import { jsonParse } from '@qlt2020/frutils';
import type { AuthState } from '@/shared/store/auth.store';
import { useAuthStore } from '@/shared/store/auth.store';

const show = ref(false);

const checkCurrentSessionChange = (e: StorageEvent) => {
  const newValue = jsonParse<AuthState>(e.newValue)?.token;
  const oldValue = jsonParse<AuthState>(e.oldValue)?.token;

  if (newValue !== oldValue)
    show.value = true;
};

const reload = () => location.reload();

useEventListener(window, 'storage', checkCurrentSessionChange);
</script>
