<template>
  <QDrawer :title="$t('product.add')">
    <template #extra>
      <SubmitButton form="product_form">
        {{ $t('action.save') }}
      </SubmitButton>
    </template>
    <ProductForm @submit="onSubmitAdd" />

    <ADivider>
      {{ $t('common.image') }}
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
  </QDrawer>
</template>

<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue/lib/upload/interface';
import ProductForm from './component/ProductForm.vue';
import { MaxFileSize } from '@/shared/config/constants';
import { useGo } from '@/shared/composables/usePage';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import type { UpdateProductDto } from '@/modules/catalog/product/product.dto';
import { ProductRepository } from '@/modules/catalog/product/product.repository';
import { useImagePreview } from '@/shared/composables/useImagePreview';

const { goToModalParent } = useGo();
const files = ref<UploadFile[]>();

const {
  previewImage,
  previewVisible,
  handleCancel,
  handlePreview,
} = useImagePreview();

function onSubmitAdd(values: UpdateProductDto) {
  if (files.value) {
    values.files = files.value.map((el: any) => {
      return el.originFileObj;
    });
  }

  Executor.run({
    request: ProductRepository.create(values),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      goToModalParent();
    },
  });
}
</script>
