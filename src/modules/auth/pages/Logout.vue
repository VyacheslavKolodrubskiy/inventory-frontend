<template>
  <div />
</template>

<script setup lang="ts">
import { PageName } from '@/shared/enums/common.enum';
import { useAuthStore } from '@/shared/store/auth.store';

const router = useRouter();
const authStore = useAuthStore();
authStore.logout();
router.replace({ name: PageName.BASE_LOGIN });
</script>
