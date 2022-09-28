<template>
  <QDrawer :title="$t('region.edit')">
    <template #extra>
      <SubmitButton form="region_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <RegionForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import RegionForm from '@/modules/catalog/region/components/RegionForm.vue';
import type { UpdateRegionDto } from '@/modules/catalog/region/region.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { RegionRepository } from '@/modules/catalog/region/region.repository';
import { useGo } from '@/shared/composables/usePage';

const route = useRoute();
const { goToModalParent } = useGo();

const dataId = computed(() => route.params.regionId as string);

function onSubmitEdit(values: UpdateRegionDto) {
  Executor.run({
    request: RegionRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      goToModalParent();
    },
  });
}
</script>
