<template>
  <QDrawer size="lg" :title="$t('counterparty-info.view')">
    <template #extra>
      <EditButton @click="goToModalEdit" />
    </template>
    <CounterpartyInfo :data-id="dataId" />
  </QDrawer>
</template>

<script setup lang="ts">
import CounterpartyInfo from '../components/CounterpartyInfo.vue';
import { useGo } from '@/shared/composables/usePage';

const { goToModalEdit } = useGo();
const route = useRoute();
const dataId = computed(() => route.params.counterpartyId as string);
</script>
