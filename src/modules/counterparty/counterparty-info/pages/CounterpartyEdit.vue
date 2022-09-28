<template>
  <QDrawer size="lg" :title="$t('counterparty-info.edit')">
    <template #extra>
      <SubmitButton form="counterparty_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CounterpartyForm
      :data-id="dataId"
      @submit="submit"
    />
  </QDrawer>
</template>

<script setup lang="ts">
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import CounterpartyForm from '@/modules/counterparty/counterparty-info/components/CounterpartyForm.vue';
import { CounterpartyInfoRepository } from '@/modules/counterparty/counterparty-info/counterparty-info.repository';
import type { UpdateCounterpartyInfoDto } from '@/modules/counterparty/counterparty-info/counterparty-info.dto';

const router = useRouter();
const route = useRoute();

const dataId = computed(() => route.params.counterpartyId as string);

function submit(values: UpdateCounterpartyInfoDto) {
  Executor.run({
    request: CounterpartyInfoRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'Counterparty.Main' });
    },
  });
}
</script>
