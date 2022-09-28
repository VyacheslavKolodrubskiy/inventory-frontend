<template>
  <QDrawer size="sm" :title="$t('region.add')">
    <template #extra>
      <SubmitButton form="region_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <RegionForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import type { UpdateRegionDto } from '@/modules/catalog/region/region.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { RegionRepository } from '@/modules/catalog/region/region.repository';
import RegionForm from '@/modules/catalog/region/components/RegionForm.vue';

const router = useRouter();

function onSubmitAdd(values: UpdateRegionDto) {
  Executor.run({
    request: RegionRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'CatalogRegion.Main' });
    },
  });
}
</script>
