<template>
  <QDrawer :title="$t('city.view')">
    <template #extra>
      <EditLink :to="{ name: 'CatalogCity.Edit' }" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />
    <template v-else-if="city">
      <ATypographyTitle :level="4">
        {{ city.title }}
      </ATypographyTitle>

      <ADescriptions size="small">
        <ADescriptionsItem :label="$t('common.region')" :span="3">
          {{ city.region.title }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="$t('common.country')" :span="3">
          {{ city.region.country.title }}
        </ADescriptionsItem>
      </ADescriptions>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import type { City } from '@/modules/catalog/city/city.model';
import { Executor } from '@/shared/network/executor';
import { CityRepository } from '@/modules/catalog/city/city.repository';
import { useLoading } from '@/shared/composables/useLoading';

const route = useRoute();
const dataId = computed(() => route.params.cityId as string);

const city = ref<Nullable<City>>(null);
const loadingState = useLoading();

onMounted(() => {
  readCity(dataId.value);
});

function readCity(dataId: UrlParam) {
  return Executor.run({
    request: CityRepository.read(dataId),
    loadingState,
    onResult(data) {
      city.value = data;
    },
  });
}
</script>
