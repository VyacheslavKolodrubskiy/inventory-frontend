<template>
  <QDrawer :title="$t('warehouse.addPlace')">
    <template #extra>
      <SubmitButton form="warehouse_place_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <WarehousePlaceForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import WarehousePlaceForm from '../components/WarehousePlaceForm.vue';
import { WarehousePlaceRepository } from '../warehouse-place.repository';
import type { UpdateWarehousePlaceDto } from '../warehouse-place.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';

const router = useRouter();

function onSubmitAdd(values: UpdateWarehousePlaceDto) {
  Executor.run({
    request: WarehousePlaceRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'Warehouse.Main' });
    },
  });
}
</script>
