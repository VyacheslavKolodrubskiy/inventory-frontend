<template>
  <QDrawer size="lg" :title="$t('warehouse.addWarehouse')">
    <template #extra>
      <SubmitButton form="warehouse_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <WarehouseForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import WarehouseForm from '../components/WarehouseForm.vue';
import { WarehouseRepository } from '../warehouse.repository';
import type { UpdateWarehouseDto } from '../warehouse.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';

const router = useRouter();

function onSubmitAdd(values: UpdateWarehouseDto) {
  Executor.run({
    request: WarehouseRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'Warehouse.Main' });
    },
  });
}
</script>
