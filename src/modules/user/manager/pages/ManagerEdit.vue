<template>
  <QDrawer :title="$t('manager.edit')">
    <template #extra>
      <SubmitButton form="manager_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ManagerForm :data-id="dataId" @submit="onSubmitEdit" />
  </QDrawer>
</template>

<script setup lang="ts">
import type { UpdateManagerDto } from '../manager.dto';
import { ManagerRepository } from '../manager.repository';
import ManagerForm from '../components/ManagerForm.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';

const router = useRouter();
const route = useRoute();

const dataId = computed(() => route.params.managerId as string);

function onSubmitEdit(values: UpdateManagerDto) {
  Executor.run({
    request: ManagerRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      router.push({ name: 'UserManager.Main' });
    },
  });
}
</script>
