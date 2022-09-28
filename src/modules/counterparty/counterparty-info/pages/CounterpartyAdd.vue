<template>
  <QDrawer size="lg" :title="$t('counterparty-info.add')">
    <template #extra>
      <SubmitButton form="counterparty_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <CounterpartyForm
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

function submit(values: UpdateCounterpartyInfoDto) {
  values.alias = values.alias.toLowerCase();
  Executor.run({
    request: CounterpartyInfoRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult() {
      router.push({ name: 'Counterparty.Main' });
    },
  });
}
</script>
