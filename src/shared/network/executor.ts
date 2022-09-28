import type { NotificationArgsProps } from 'ant-design-vue/es/notification';
import type { LoadingService } from '@/types';
import { useGlobalLoading, useSecondaryLoading } from '@/shared/composables/useLoading';
import type { OperationError } from '@/shared/network/operation-result';
import { OperationResult } from '@/shared/network/operation-result';
import { UiUtils } from '@/shared/network/ui-utils';
import { Logger } from '@/shared/utils/logger';
import type { UsePaginationReturn } from '@/shared/composables/usePagination';
import { Pagination } from '@/shared/network/pagination.response';
import { i18n } from '@/i18n';

export const enum MessageType {
  Done = 'common.done',
  Created = 'common.created[1]',
  Updated = 'common.updated',
  Saved = 'common.saved',
  Deleted = 'common.deleted',
}

export const enum LoadingType {
  Global = 'global',
  Secondary = 'secondary',
}

export interface ExecutorOptions<T> {
  request: Promise<OperationResult<T>>
  loadingState?: LoadingService
  loadingType?: LoadingType
  messageType?: MessageType
  notificationConfig?: Partial<NotificationArgsProps>
  pagination?: UsePaginationReturn
  ignoreError?: boolean
  onResult?: (data: T) => void
  onError?: (error: OperationError<T>) => void
  onComplete?: () => void
}
const _logger = new Logger('Executor');

const globalLoadingState = useGlobalLoading();
const secondaryLoadingState = useSecondaryLoading();

export abstract class Executor {
  static async run<T = any>(options: ExecutorOptions<T>): Promise<OperationResult<T>> {
    const {
      request,
      messageType,
      loadingType,
      notificationConfig,
      ignoreError = false,
      pagination,
      onResult,
      onError,
      onComplete,
    } = options;
    let { loadingState } = options;

    if (!loadingState && loadingType)
      loadingState = loadingType === LoadingType.Global ? globalLoadingState : secondaryLoadingState;

    const loading = (loading: boolean) => {
      if (loadingState)
        loading ? loadingState.startLoading() : loadingState.stopLoading();
    };

    const handleError = (error: OperationError<T>) => {
      onError?.(error);

      if (!ignoreError)
        UiUtils.showError(error, notificationConfig);

      _logger.log(error.toString());
    };

    try {
      loading(true);

      const result = await request;

      if (result.isSuccessful()) {
        if (messageType)
          showMessage(messageType);

        if (pagination && result.data instanceof Pagination) {
          pagination.total = result.data.total;
          pagination.lastPage = result.data.lastPage;
        }
        onResult?.(result.data);
      } else if (result.isUnsuccessful()) {
        handleError(result);
      }

      return result;
    } catch (error) {
      const errorResult = OperationResult.fromError<T>(error);

      if (errorResult.isUnsuccessful())
        handleError(errorResult);

      return errorResult;
    } finally {
      loading(false);
      onComplete?.();
    }
  }
}

function showMessage(type: MessageType) {
  return message.success(i18n.t(type));
}
