<template>
  <div class="flex items-center justify-center min-h-screen">
    <AResult status="404" title="404">
      <template #subTitle>
        {{ $t('common.error404DescriptionNotFound') }}
        <br>
        {{ $t('common.error404DescriptionDeleted') }}
      </template>
      <template #extra>
        <QLink :to="path" type="primary">
          {{ $t('common.goToMainPage') }}
        </QLink>
      </template>
    </AResult>
  </div>
</template>

<script setup lang="ts">
import { PageName } from '@/shared/enums/common.enum';
import { useAuthStore } from '@/shared/store/auth.store';

const authStore = useAuthStore();

const path = computed(() => ({ name: authStore.isLoggedIn ? PageName.BASE_HOME : PageName.BASE_LOGIN }));
</script>
