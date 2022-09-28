<template>
  <QDrawer :title="$t('warehouse.editPlace')">
    <template #extra>
      <SubmitButton form="warehouse_place_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <WarehousePlaceForm
      :data-id="dataId"
      @submit="onSubmitEdit"
    />
  </QDrawer>
</template>

<script setup lang="ts">
import WarehousePlaceForm from '../components/WarehousePlaceForm.vue';
import { WarehousePlaceRepository } from '../warehouse-place.repository';
import type { UpdateWarehousePlaceDto } from '../warehouse-place.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';

const route = useRoute();
const router = useRouter();

const dataId = computed(() => route.params.warehousePlaceId as string);

const onSubmitEdit = (values: UpdateWarehousePlaceDto) => {
  Executor.run({
    request: WarehousePlaceRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'Warehouse.Main' });
    },
  });
};
</script>
