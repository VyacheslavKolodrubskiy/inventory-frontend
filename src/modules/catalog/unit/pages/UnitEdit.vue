<template>
  <QDrawer size="sm" :title="$t('unit.edit')">
    <template #extra>
      <SubmitButton form="unit_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <UnitForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import UnitForm from './component/UnitForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateUnitDto } from '@/modules/catalog/unit/unit.dto';
import { UnitRepository } from '@/modules/catalog/unit/unit.repository';

const route = useRoute();
const router = useRouter();

const dataId = computed(() => route.params.unitId as string);

const onSubmitEdit = (values: UpdateUnitDto) => {
  Executor.run({
    request: UnitRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'CatalogUnit.Main' });
    },
  });
};
</script>
