<template>
  <QDrawer size="sm" :title="$t('country.add')">
    <template #extra>
      <SubmitButton form="country_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CountryForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import CountryForm from '../components/CountryForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateCountryDto } from '@/modules/catalog/country/country.dto';
import { CountryRepository } from '@/modules/catalog/country/country.repository';
const router = useRouter();

function onSubmitAdd(values: UpdateCountryDto) {
  Executor.run({
    request: CountryRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      router.push({ name: 'CatalogCountry.Main' });
    },
  });
}
</script>
