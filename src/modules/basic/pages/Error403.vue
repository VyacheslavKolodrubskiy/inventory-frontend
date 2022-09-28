<template>
  <div class="flex items-center justify-center min-h-screen">
    <AResult status="403" title="403">
      <template #subTitle>
        {{ $t('common.error403Description') }}
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

const path = computed(() => ({ name: PageName.BASE_HOME }));
</script>
