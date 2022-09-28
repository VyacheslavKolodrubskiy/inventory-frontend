<template>
  <QDrawer :title="$t('product.import')">
    <template #extra>
      <SubmitButton :disabled="!fileSelected" @click="onSubmitImport">
        {{ $t('action.import') }}
      </SubmitButton>
    </template>

    <AAlert
      class="mb-5"
      :message="$t('movement.message.forImportFromProductList')"
      show-icon
      type="info"
    >
      <template #description>
        <ATypographyText>
          <ol>
            <li>
              <ATypographyLink
                href="https://docs.google.com/spreadsheets/d/15L_oc_eCEp0FdmVub4l3Go6hDCFpF52NP0kFymRGrus/edit#gid=641225289"
                target="_blank"
                underline
              >
                {{ $t('movement.message.downloadTableTemplate') }}
              </ATypographyLink>
            </li>
            <li> {{ $t('movement.message.fillInTactWithColumnName') }}</li>
            <li> {{ $t('movement.message.selectFileBelow') }}</li>
          </ol>
        </ATypographyText>
      </template>
    </AAlert>
    <div class="h-60 pb-8 mb-2">
      <QUpload
        v-model:value="fileSelected"
        accept-spreadsheet
        drag-and-drop
        :max-file-size-kilobytes="MaxFileSize.ProductImport"
      >
        <div class="flex flex-col justify-center h-full px-4">
          <p class="ant-upload-drag-icon">
            <FileExcelOutlined />
          </p>
          <p class="ant-upload-text">
            {{ $t('message.selectFileWithFormat') }} XLSX
          </p>
          <p class="ant-upload-hint">
            {{ $t('message.dragOrSelectFile') }}<br>
            <i18n-t
              keypath="common.maxFileSize"
              scope="global"
            >
              <template #content>
                <strong>{{ MaxFileSize.ProductImport }}Kb</strong>
              </template>
            </i18n-t>
            <br>
            <i18n-t
              keypath="common.maxFileLength"
              scope="global"
            >
              <template #content>
                <strong>1000</strong>
              </template>
            </i18n-t>
          </p>
        </div>
      </QUpload>
    </div>

    <ATypographyText v-if="fileSelected" type="success">
      {{ $t('message.fileIsUploaded') }}
    </ATypographyText>
  </QDrawer>
</template>

<script setup lang="ts">
import type { Nullable } from '@qlt2020/frutils';
import { MaxFileSize } from '@/shared/config/constants';
import { useGo } from '@/shared/composables/usePage';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
const { goToModalParent } = useGo();
const { t } = useI18n();
const fileSelected = ref<Nullable<File>>(null);

function onSubmitImport() {
  if (!fileSelected.value)
    return;

  Executor.run({
    request: ProductRepository.import(fileSelected.value),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      message.success(t('common.fileNameIsUploaded', { fileName: fileSelected?.value?.name }));
      goToModalParent();
    },
  });
}
</script>
