<template>
  <div class="mx-auto py-6 max-w-150">
    <ATypographyTitle class="text-center" :level="3">
      {{ $t('common.myProfile') }}
    </ATypographyTitle>

    <ADivider plain>
      {{ $t('common.userInfoEditing') }}
    </ADivider>

    <ACard>
      <ProfileForm @submit="submit" />

      <div class="text-right">
        <SubmitButton form="profile_form" />
      </div>
    </ACard>
  </div>

  <ACard />
</template>

<script setup lang="ts">
import ProfileForm from '@/modules/profile/components/ProfileForm.vue';
import type { UserDto } from '@/shared/dto/user.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { UserRepository } from '@/shared/repository/user.repository';
import { useUserStore } from '@/shared/store/user.store';

const userStore = useUserStore();

function submit(values: UserDto) {
  Executor.run({
    request: UserRepository.update(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult(data) {
      userStore.setCurrentUser(data);
    },
  });
}
</script>
