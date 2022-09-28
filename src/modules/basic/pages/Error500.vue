<template>
  <div class="flex items-center justify-center min-h-screen">
    <AResult status="500" title="500">
      <template #subTitle>
        {{ $t('common.error500Description') }}
        <br>
        {{ $t('common.tryAgainLater') }}
      </template>
      <template #extra>
        <QLink :to="getRouteLocation" type="primary">
          {{ $t('action.tryAgain') }}
        </QLink>
      </template>
    </AResult>
  </div>
</template>

<script setup lang="ts">
import { PageName } from '@/shared/enums/common.enum';

const route = useRoute();

const getRouteLocation = computed(() => (route.query.redirect || { name: PageName.BASE_HOME }));
</script>
