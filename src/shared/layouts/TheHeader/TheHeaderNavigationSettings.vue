<template>
  <APopover
    placement="bottomRight"
    trigger="click"
  >
    <template #title>
      <div class="flex">
        {{ $t('common.displaySettings') }}
        <ATypographyLink class="ml-auto" @click.prevent="appStore.resetLayoutSettings">
          {{ $t('action.reset') }}
        </ATypographyLink>
      </div>
    </template>
    <template #content>
      <AList>
        <AListItem class="py-2">
          {{ $t('common.menuOnTop') }}
          <template #actions>
            <ASwitch v-model:checked="appStore.settings.navigationTop" size="small" />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.menuAccordion') }}
          <ATooltip :title="$t('message.onlyOneSubmenu')">
            <InfoCircleOutlined class="ml-1 text-gray-500" />
          </ATooltip>

          <template #actions>
            <ASwitch v-model:checked="appStore.settings.navigationAccordion" size="small" />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.fixHeader') }}
          <template #actions>
            <ASwitch v-model:checked="appStore.settings.fixedHeader" size="small" />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.fixSidebar') }}
          <template #actions>
            <ASwitch v-model:checked="appStore.settings.fixedSidebar" size="small" />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.colorMode') }}
          <template #actions>
            <ASelect
              v-model:value="appStore.settings.colorMode"
              class="w-35"
              :options="colorModeOptions"
              size="small"
              @change="onChangeColorMode"
            />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.headerColor') }}
          <template #actions>
            <ASelect
              v-model:value="appStore.settings.headerTheme"
              class="w-25"
              :options="themeOptions"
              size="small"
            />
          </template>
        </AListItem>

        <AListItem class="py-2">
          {{ $t('common.sidebarColor') }}
          <template #actions>
            <ASelect
              v-model:value="appStore.settings.sidebarTheme"
              class="w-25"
              :options="themeOptions"
              size="small"
            />
          </template>
        </AListItem>
      </AList>
    </template>

    <AButton
      class="page-header__action"
      type="text"
    >
      <SettingOutlined />
    </AButton>
  </APopover>
</template>

<script lang="ts" setup>
import type { SelectValue } from 'ant-design-vue/es/select';
import type { ColorMode, NavigationTheme } from '@/shared/config/layout-settings';
import { useAppStore } from '@/shared/store/app.store';
import { updateColorMode } from '@/shared/config/app-config';

const appStore = useAppStore();
const { t } = useI18n();

const themeOptions: { label: string; value: NavigationTheme }[] = [
  { label: t('common.light'), value: 'light' },
  { label: t('common.dark'), value: 'dark' },
];
const colorModeOptions: { label: string; value: ColorMode }[] = [
  { label: t('common.default'), value: 'none' },
  { label: t('common.colorblind'), value: 'weak' },
  { label: t('common.grayShades'), value: 'gray' },
];

function onChangeColorMode(value: SelectValue) {
  updateColorMode(value as ColorMode);
}
</script>
