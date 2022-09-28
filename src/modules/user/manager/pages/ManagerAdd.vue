<template>
  <QDrawer :title="$t('manager.add')">
    <template #extra>
      <SubmitButton form="manager_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ManagerForm @submit="onSubmitAdd" />
  </QDrawer>
</template>

<script setup lang="ts">
import type { UpdateManagerDto } from '../manager.dto';
import { ManagerRepository } from '../manager.repository';
import ManagerForm from '../components/ManagerForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';

const router = useRouter();

function onSubmitAdd(values: UpdateManagerDto) {
  Executor.run({
    request: ManagerRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult() {
      router.push({ name: 'UserManager.Main' });
    },
  });
}
</script>
