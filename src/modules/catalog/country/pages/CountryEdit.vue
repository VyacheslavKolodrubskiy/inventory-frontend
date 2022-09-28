<template>
  <QDrawer size="sm" :title="$t('country.edit')">
    <template #extra>
      <SubmitButton form="country_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CountryForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import CountryForm from '../components/CountryForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateCountryDto } from '@/modules/catalog/country/country.dto';
import { CountryRepository } from '@/modules/catalog/country/country.repository';
import { useGo } from '@/shared/composables/usePage';

const route = useRoute();
const { goToModalParent } = useGo();

const dataId = computed(() => route.params.countryId as string);

const onSubmitEdit = (values: UpdateCountryDto) => {
  Executor.run({
    request: CountryRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      goToModalParent();
    },
  });
};
</script>
