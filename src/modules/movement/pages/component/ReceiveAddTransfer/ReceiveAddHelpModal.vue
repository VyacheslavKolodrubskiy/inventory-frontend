<template>
  <AModal
    :cancel-text="$t('common.clear')"
    :ok-button-props="okBtnProps"
    :title="$t('movement.receivingCreation')"
  >
    <div class="pb-4">
      <ADivider class="mt-0">
        {{ $t('movement.receivingProductsAdd') }}
      </ADivider>
      <ATypographyParagraph>{{ $t('movement.message.selectProductCountAndWarehousePlace') }}</ATypographyParagraph>
      <ATypographyParagraph>{{ $t('movement.message.receivingCreatedAfterSubmit') }}</ATypographyParagraph>
    </div>

    <ADivider>{{ $t('common.documentInfoEditing') }}</ADivider>
    <ATypographyParagraph>{{ $t('movement.message.clickDocumentInfo') }}</ATypographyParagraph>
  </AModal>
</template>

<script lang="ts" setup>
const okBtnProps = { class: 'hidden' } as any;
</script>
