<template>
  <QPageHeader :title="$t('counterparty-info.view')" />
  <ACard>
    <CounterpartyInfo :data-id="dataId" />
  </ACard>
</template>

<script setup lang="ts">
import CounterpartyInfo from '../components/CounterpartyInfo.vue';
import { useUserStore } from '@/shared/store/user.store';

const { current } = useUserStore();

const dataId = computed(() => current.counterparty!.id.toString());
</script>
