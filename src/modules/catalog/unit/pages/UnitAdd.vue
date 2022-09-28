<template>
  <QDrawer size="sm" :title="$t('unit.add')">
    <template #extra>
      <SubmitButton form="unit_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <UnitForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import UnitForm from './component/UnitForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateUnitDto } from '@/modules/catalog/unit/unit.dto';
import { UnitRepository } from '@/modules/catalog/unit/unit.repository';
const router = useRouter();

function onSubmitAdd(values: UpdateUnitDto) {
  Executor.run({
    request: UnitRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'CatalogUnit.Main' });
    },
  });
}
</script>
