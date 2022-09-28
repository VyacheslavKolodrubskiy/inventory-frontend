<template>
  <QDrawer size="sm" :title="$t('city.edit')">
    <template #extra>
      <SubmitButton form="city_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CityForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import CityForm from '@/modules/catalog/city/components/CityForm.vue';
import type { UpdateCityDto } from '@/modules/catalog/city/city.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { CityRepository } from '@/modules/catalog/city/city.repository';
import { useGo } from '@/shared/composables/usePage';

const route = useRoute();
const { goToModalParent } = useGo();

const dataId = computed(() => route.params.cityId as string);

function onSubmitEdit(values: UpdateCityDto) {
  Executor.run({
    request: CityRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      goToModalParent();
    },
  });
}
</script>
