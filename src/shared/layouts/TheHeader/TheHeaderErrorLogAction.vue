<template>
  <AButton
    class="page-header__action"
    type="text"
    @click="showErrorLog"
  >
    <ABadge :dot="!!errorLogStore.getErrorLogCount">
      <BugOutlined />
    </ABadge>
  </AButton>

  <AModal
    v-model:visible="isErrorLogVisible"
    centered
    :footer="null"
    :title="$t('common.errorJournal')"
    width="800px"
  >
    <AList>
      <AListItem
        v-for="errorLogItem in errorLogStore.errorLog"
        :key="errorLogItem.time"
        class="flex-wrap"
      >
        <div class="w-full">
          <ATypographyTitle class="mb-4" :level="5">
            <ATag :color="ErrorTypeMap[errorLogItem.type]">
              {{ errorLogItem.type }}
            </ATag>
            <ABadge :count="errorLogItem.count">
              [{{ errorLogItem.name }}] {{ errorLogItem.message }}
            </ABadge>
          </ATypographyTitle>

          <ADescriptions
            bordered
            layout="vertical"
            size="small"
          >
            <ADescriptionsItem label="Time">
              {{ errorLogItem.time }}
            </ADescriptionsItem>

            <ADescriptionsItem label="Url" :span="2">
              {{ errorLogItem.url }}
            </ADescriptionsItem>

            <ADescriptionsItem
              v-if="errorLogItem.file"
              label="File"
              :span="2"
            >
              {{ errorLogItem.file }}
            </ADescriptionsItem>

            <ADescriptionsItem
              v-if="errorLogItem.detail"
              label="Detail"
              :span="2"
            >
              {{ errorLogItem.detail }}
            </ADescriptionsItem>
          </ADescriptions>
        </div>

        <div v-if="errorLogItem.stack?.length" class="w-full">
          <ADivider orientation="left">
            Stack
          </ADivider>
          <ul class="pl-4 break-words">
            <li v-for="(line, index) in errorLogItem.stack.split('~')" :key="index">
              {{ line }}
            </li>
          </ul>
        </div>
      </AListItem>
    </AList>
  </AModal>
</template>

<script lang="ts" setup>
import { ErrorType, useErrorLogStore } from '@/shared/store/error-log.store';

const errorLogStore = useErrorLogStore();
const isErrorLogVisible = ref(false);

const ErrorTypeMap = {
  [ErrorType.VUE]: 'green',
  [ErrorType.SCRIPT]: 'red',
  [ErrorType.RESOURCE]: 'purple',
  [ErrorType.AJAX]: 'cyan',
  [ErrorType.PROMISE]: 'blue',
};

function showErrorLog() {
  isErrorLogVisible.value = true;
}
</script>
