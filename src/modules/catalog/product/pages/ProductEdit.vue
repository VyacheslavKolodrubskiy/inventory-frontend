<template>
  <QDrawer :title="$t('product.edit')">
    <template #extra>
      <SubmitButton form="product_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ASkeleton v-if="loadingState.isLoading.value" active />
    <template v-else>
      <ProductForm :product="product" @submit="onSubmitEdit" />

      <ADivider>
        {{ $t('common.image') }}
        <ATooltip :title="$t('message.fileListAutoSaving')">
          <ATag class="ml-1" color="green">
            <SaveOutlined />
            {{ $t('common.autoSave') }}
          </ATag>
        </ATooltip>
      </ADivider>

      <AAlert
        class="mb-2"
        show-icon
        type="info"
      >
        <template #description>
          <ATypographyText>
            {{ $t('message.selectFileWithFormat') }} JPG, PNG
          </ATypographyText>
          <br>
          <i18n-t keypath="common.maxFileSize">
            <template #content>
              <strong>{{ MaxFileSize.ProductAvatar }}Kb</strong>
            </template>
          </i18n-t>
        </template>
      </AAlert>
      <QUpload
        v-model:value="files"
        accept-img
        :async-remove="deleteFile"
        :custom-request="addFile"
        list-type="picture-card"
        :max-file-size-kilobytes="MaxFileSize.ProductAvatar "
        multiple
        @preview="handlePreview"
      >
        <div>
          <PlusOutlined />
          <div>
            {{ $t('action.upload') }}
          </div>
        </div>
      </QUpload>

      <AModal
        :footer="null"
        :visible="previewVisible"
        @cancel="handleCancel"
      >
        <img
          alt="preview"
          :src="previewImage"
          style="width: 100%"
        >
      </AModal>
    </template>
  </QDrawer>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UploadFile } from 'ant-design-vue/lib/upload/interface';
import type { UploadChangeParam } from 'ant-design-vue/es/upload/interface';
import type { Product } from '../product.model';
import ProductForm from './component/ProductForm.vue';
import { MaxFileSize } from '@/shared/config/constants';
import { useGo } from '@/shared/composables/usePage';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateProductDto } from '@/modules/catalog/product/product.dto';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import { useLoading } from '@/shared/composables/useLoading';
import { useImagePreview } from '@/shared/composables/useImagePreview';
import { createFileList } from '@/shared/utils/utils';

const route = useRoute();
const loadingState = useLoading();
const files = ref<UploadFile[]>();
const product = ref<Product>();

const { goToModalParent } = useGo();

const { t } = useI18n();

const {
  previewImage,
  previewVisible,
  handleCancel,
  handlePreview,
} = useImagePreview();

const dataId = computed(() => route.params.productId as string);

function readProduct(id: UrlParam) {
  return Executor.run({
    request: ProductRepository.read(id),
    loadingState,
    onResult(data) {
      product.value = data;
      files.value = createFileList(data.images);
    },
  });
}

function deleteFile(file: UploadFile) {
  return new Promise<void>((resolve) => {
    Modal.confirm({
      title: t('common.confirmation'),
      content: t('message.confirmDeleteFile'),
      okText: t('action.delete'),
      cancelText: t('common.cancel'),
      onOk() {
        Executor.run({
          request: ProductRepository.deleteFile({ productId: product.value?.id.toString(), imageId: file.uid }),
          messageType: MessageType.Deleted,
          onResult() {
            resolve();
          },
        });
      },
    });
  });
}

function addFile(data: UploadChangeParam) {
  Executor.run({
    request: ProductRepository.addFile(dataId.value, data.file),
    messageType: MessageType.Saved,
    onResult() {
      readProduct(dataId.value);
    },
  });
}

onMounted(() => {
  readProduct(dataId.value);
});

const onSubmitEdit = (values: UpdateProductDto) => {
  Executor.run({
    request: ProductRepository.update(dataId.value, values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Updated,
    onResult() {
      goToModalParent();
    },
  });
};
</script>
