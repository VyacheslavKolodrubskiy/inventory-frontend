<template>
  <div class="w-full p-2">
    <ADropdown
      placement="bottomRight"
      :trigger="['click']"
    >
      <AButton
        block
        :class="{ 'ant-btn-icon-only': appStore.isSidebarCollapsed }"
        size="large"
        type="primary"
      >
        <PlusOutlined v-if="appStore.isSidebarCollapsed" />
        <span v-else>{{ $t('action.createDocument') }}</span>
      </AButton>

      <template #overlay>
        <AMenu @click="handleMenuClick">
          <AMenuItem
            v-for="item in menuItems"
            :key="item.key"
            class="text-base"
          >
            {{ item.title }}
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>

<script setup lang="ts">
import type { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';
import { useAppStore } from '@/shared/store/app.store';

const appStore = useAppStore();
const router = useRouter();

const { t } = useI18n();

const menuItems = [
  { title: t('common.marking'), key: 'Marking.Add' },
  { title: t('common.receiving'), key: 'Movement.Receive.Add' },
  { title: t('common.writeOff'), key: 'Movement.WriteOff.Add' },
  { title: t('common.movement'), key: 'Movement.Relocation.Add' },
  { title: t('common.inventory'), key: 'Inventory.Add' },
];
const handleMenuClick: MenuClickEventHandler = (menuInfo) => {
  router.push({ name: menuInfo.key as string });
};
</script>
