<template>
  <QDrawer size="sm" :title="$t('city.add')">
    <template #extra>
      <SubmitButton form="city_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CityForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import CityForm from '@/modules/catalog/city/components/CityForm.vue';
import type { UpdateCityDto } from '@/modules/catalog/city/city.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { CityRepository } from '@/modules/catalog/city/city.repository';

const router = useRouter();

function onSubmitAdd(values: UpdateCityDto) {
  Executor.run({
    request: CityRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'CatalogCity.Main' });
    },
  });
}
</script>
