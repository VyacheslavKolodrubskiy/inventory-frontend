<template>
  <AButton @click="() => $router.go(-1)">
    <slot>{{ $t('common.cancel') }}</slot>
  </AButton>
</template>
