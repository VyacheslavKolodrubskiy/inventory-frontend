<template>
  <QDrawer :title="$t('warehouse.viewPlace')">
    <template #extra>
      <EditLink :to="{ name: 'WarehousePlace.Edit' }" />
    </template>
    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="warehousePlace">
      <ATypographyTitle :level="4">
        {{ warehousePlace.title }} - {{ warehousePlace.warehouse?.title }}
      </ATypographyTitle>

      {{ warehousePlace.description }}
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import { WarehousePlaceRepository } from '../warehouse-place.repository';
import type { WarehousePlace } from '../warehouse-place.model';
import { Executor } from '@/shared/network/executor';
import { useLoading } from '@/shared/composables/useLoading';

const route = useRoute();

const dataId = computed(() => route.params.warehousePlaceId as string);
const loadingState = useLoading();

const warehousePlace = ref<Nullable<WarehousePlace>>(null);

onMounted(() => {
  readWarehousePlace(dataId.value);
});

function readWarehousePlace(dataId: UrlParam) {
  return Executor.run({
    request: WarehousePlaceRepository.read(dataId),
    loadingState,
    onResult(data) {
      warehousePlace.value = data;
    },
  });
}
</script>
