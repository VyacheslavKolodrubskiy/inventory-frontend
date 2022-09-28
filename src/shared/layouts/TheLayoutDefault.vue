<template>
  <ALayout class="page-layout">
    <TheSidebar />
    <ALayout>
      <TheHeader />
      <ALayoutContent class="page-content">
        <RouterView />
      </ALayoutContent>
    </ALayout>
    <LoadingOverlay
      :active="isLoading"
      full-page
    />
  </ALayout>
</template>

<script setup lang="ts">
import TheSidebar from '@/shared/layouts/TheSidebar/TheSidebar.vue';
import TheHeader from '@/shared/layouts/TheHeader/TheHeader.vue';
import { useGlobalLoading } from '@/shared/composables/useLoading';
const { isLoading } = useGlobalLoading();
</script>
