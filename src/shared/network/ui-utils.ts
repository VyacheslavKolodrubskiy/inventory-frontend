import { notification } from 'ant-design-vue';
import { h } from 'vue';
import type { NotificationArgsProps } from 'ant-design-vue/es/notification';
import type { OperationError } from '@/shared/network/operation-result';
import { i18n } from '@/i18n';

export abstract class UiUtils {
  static showError(error: OperationError<any>, notificationConfig?: Partial<NotificationArgsProps>) {
    if (!error.message)
      return;

    notification.error({
      message: i18n.t('common.error'),
      description: h('div', {
        class: 'ant-space ant-space-vertical',
        style: { gap: '8px' },
        innerHTML: error.message,
      }),
      ...notificationConfig,
    });
  }
}
