<template>
  <QDrawer size="lg" :title="$t('warehouse.editWarehouse')">
    <template #extra>
      <SubmitButton form="warehouse_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <WarehouseForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import WarehouseForm from '../components/WarehouseForm.vue';
import type { UpdateWarehouseDto } from '../warehouse.dto';
import { WarehouseRepository } from '../warehouse.repository';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
const route = useRoute();
const router = useRouter();

const dataId = computed(() => route.params.warehouseId as string);

const onSubmitEdit = (values: UpdateWarehouseDto) => {
  Executor.run({
    request: WarehouseRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'Warehouse.Main' });
    },
  });
};
</script>
