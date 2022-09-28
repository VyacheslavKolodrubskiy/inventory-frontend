<template>
  <div class="flex items-center justify-center min-h-screen">
    <AResult status="500" :title="$t('common.malformedLink')">
      <template #subTitle>
        {{ $t('common.errorMalformedLinkDescription') }}
      </template>
      <template #extra>
        <AButton type="primary" @click="() => $router.go(-1)">
          {{ $t('action.goBack') }}
        </AButton>
      </template>
    </AResult>
  </div>
</template>
