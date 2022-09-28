<template>
  <AModal
    :cancel-text="$t('common.clear')"
    :ok-button-props="okBtnProps"
    :title="$t('inventory.creation')"
  >
    <div class="pb-4">
      <ADivider class="mt-0">
        {{ $t('inventory.addProducts') }}
      </ADivider>
      <ATypographyParagraph> {{ $t('message.selectAndTransferProduct') }}</ATypographyParagraph>
      <ATypographyParagraph> {{ $t('inventory.message.createAfterSubmit') }}</ATypographyParagraph>
    </div>

    <ADivider>{{ $t('common.documentInfoEditing') }}</ADivider>
    <ATypographyParagraph>{{ $t('message.clickInfoBtnToEditDocument') }}</ATypographyParagraph>
  </AModal>
</template>

<script lang="ts" setup>
const okBtnProps = { class: 'hidden' } as any;
</script>
