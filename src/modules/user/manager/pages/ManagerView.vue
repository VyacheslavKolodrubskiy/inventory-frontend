<template>
  <QDrawer :title="$t('manager.view')">
    <template v-if="$canUse('Admin')" #extra>
      <EditLink :to="{ name: 'UserManager.Edit' }" />
    </template>

    <ASkeleton v-if="loadingState.isLoading.value" active />

    <template v-else-if="user">
      <ATypographyTitle :level="4">
        {{ user.name }}
      </ATypographyTitle>

      <div>
        <ATag :color="user.status.color">
          {{ $t(user.status.title) }}
        </ATag>
      </div>

      <ADivider>{{ $t('common.information') }}</ADivider>

      <ARow :gutter="[20, 20]">
        <ACol :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <MailOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.mail')">
              <ATypographyText copyable>
                {{ user.email }}
              </ATypographyText>
            </SingleDescription>
          </div>
        </ACol>
        <ACol :md="12">
          <PermissionLink
            class="flex items-center"
            permission="Admin"
            :to="{ name: 'Manager.Counterparty.View', params: { counterpartyId: user.counterparty.id } }"
          >
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <BankOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.counterparty')">
              {{ user.counterparty.title }}
            </SingleDescription>
          </PermissionLink>
        </ACol>
        <ACol v-if="user.phone" :md="12">
          <div class="flex items-center">
            <AAvatar class="bg-blue-50 text-blue-500 mr-2" shape="square">
              <template #icon>
                <PhoneOutlined />
              </template>
            </AAvatar>
            <SingleDescription :description="$t('common.phone')">
              <ATypographyText copyable>
                {{ user.phone }}
              </ATypographyText>
            </SingleDescription>
          </div>
        </ACol>
      </ARow>

      <template v-if="user.warehouses">
        <ADivider>
          {{ $t('common.warehouses') }}
        </ADivider>

        <ATable
          :columns="columns"
          :data-source="user.warehouses"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'title'">
              <RouterLink class="flex items-center" :to="{ name: 'Warehouse.View', params: { warehouseId: record.id } }">
                {{ text }}
              </RouterLink>
            </template>
          </template>
        </ATable>
      </template>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable, UrlParam } from '@qlt2020/frutils';
import { ManagerRepository } from '../manager.repository';
import type { Manager } from '../manager.model';
import PermissionLink from '@/shared/components/PermissionLink.vue';
import { Executor } from '@/shared/network/executor';
import { useLoading } from '@/shared/composables/useLoading';

const user = ref<Nullable<Manager>>(null);

const route = useRoute();
const loadingState = useLoading();

const { t } = useI18n();

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
];

onMounted(() => {
  readManager(route.params.managerId as UrlParam);
});

function readManager(dataId: UrlParam) {
  return Executor.run({
    request: ManagerRepository.read(dataId),
    loadingState,
    onResult(data) {
      user.value = data;
    },
  });
}
</script>
