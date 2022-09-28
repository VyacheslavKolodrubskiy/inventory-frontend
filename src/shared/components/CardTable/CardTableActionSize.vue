<template>
  <ATooltip>
    <template #title>
      {{ $t('common.size') }}
    </template>

    <ADropdown placement="bottomRight" :trigger="['click']">
      <AButton
        class="ant-btn-icon-only"
        type="text"
      >
        <ColumnHeightOutlined />
      </AButton>

      <template #overlay>
        <AMenu :selected-keys="[modelValue]" @click="onMenuClick">
          <AMenuItem key="small">
            {{ $t('common.compact') }}
          </AMenuItem>
          <AMenuItem key="middle">
            {{ $t('common.regular') }}
          </AMenuItem>
          <AMenuItem key="large">
            {{ $t('common.large') }}
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </ATooltip>
</template>

<script lang="ts" setup>
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { SizeType } from 'ant-design-vue/es/config-provider/context';

const props = defineProps<{
  modelValue: NonNullable<SizeType>
}>();
const emit = defineEmits(['update:modelValue']);

function onMenuClick({ key }: MenuInfo) {
  emit('update:modelValue', key);
}
</script>
