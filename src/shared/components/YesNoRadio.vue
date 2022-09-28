<template>
  <ARadioGroup name="isMarked">
    <ARadio :value="1">
      {{ $t('common.yes') }}
    </ARadio>
    <ARadio :value="0">
      {{ $t('common.no') }}
    </ARadio>
  </ARadioGroup>
</template>

<script lang="ts" setup>

</script>
