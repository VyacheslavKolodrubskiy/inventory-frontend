import type { App } from 'vue';
import { ErrorType, useErrorLogStoreOutside } from '@/shared/store/error-log.store';
import { ParseError } from '@/shared/utils/errors';
import { i18n } from '@/i18n';
export function registerErrorHandlers(app: App) {
  // Global handler for uncaught errors propagating from within the application
  app.config.errorHandler = vueErrorHandler;

  // Catch errors, which are outside Vue execution (script error)
  window.onerror = scriptErrorHandler;

  // Catch rejected Promises that has no handler
  window.addEventListener('unhandledrejection', promiseErrorHandler, true);

  // Static resource exception
  window.addEventListener('error', resourceErrorHandler, true);
}

const showErrorModal = (title = 'common.error', message: string) => {
  Modal.warning({
    title: i18n.t(title),
    content: message,
  });
};

const debouncedErrorModal = useDebounceFn(showErrorModal, 200);

function formatComponentName(vm: any) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root',
    };
  }

  const options = vm.$options;
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous',
    };
  }

  const name = options.name || options._componentTag;
  return {
    name,
    path: options.__file,
  };
}

function processStackMessage(error: Error) {
  if (!error.stack)
    return '';

  let stack = error.stack
    .replace(/\n/gi, '') // Remove line breaks to save the size of the transmitted content
    .replace(/\bat\b/gi, '@') // At in chrome, @ in ff
    .split('@') // Split information with @
    .slice(0, 9) // The maximum stack length (Error.stackTraceLimit = 10), so only take the first 10
    .map(v => v.replace(/^\s*|\s*$/g, '')) // Remove extra spaces
    .join('~') // Manually add separators for later display
    .replace(/\?[^:]+/gi, ''); // Remove redundant parameters of js file links (?x=1 and the like)
  const msg = error.toString();
  if (!stack.includes(msg))
    stack = `${msg}@${stack}`;

  return stack;
}

const errorLogStore = useErrorLogStoreOutside();
const throttledAddError = useThrottleFn(errorLogStore.addErrorLogInfo, 1000);

function vueErrorHandler(err: unknown, vm: any, info: string) {
  const { name, path } = formatComponentName(vm);

  throttledAddError({
    type: ErrorType.VUE,
    name,
    file: path,
    message: (err as Error).message,
    stack: processStackMessage(err as Error),
    detail: info,
    url: window.location.href,
  });
}

function promiseErrorHandler(event: PromiseRejectionEvent) {
  const reason = event.reason;

  let message = reason;
  let detail;

  if (reason instanceof ParseError) {
    message = reason.message;
    detail = reason.description;
    debouncedErrorModal('common.errorServer', message);
  }

  throttledAddError({
    type: ErrorType.PROMISE,
    name: 'Promise Error',
    message,
    detail,
    url: window.location.href,
  });
}

function resourceErrorHandler(e: Event) {
  // @ts-expect-error
  if (e?.message === 'ResizeObserver loop limit exceeded')
    return;

  const target = e.target || {} as any;

  throttledAddError({
    type: ErrorType.RESOURCE,
    name: 'Resource Error',
    file: target.currentSrc,
    detail: JSON.stringify({
      tagName: target.localName,
      html: target.outerHTML,
      type: e.type,
    }),
    url: window.location.href,
    message: `${target.localName} resource load error`,
  });
}

export function scriptErrorHandler(
  message: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
) {
  if (
    // https://blog.sentry.io/2016/05/17/what-is-script-error
    (message === 'Script error.' && !source)
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    || message === 'ResizeObserver loop limit exceeded')
    return;

  throttledAddError({
    type: ErrorType.SCRIPT,
    name: source ? source.slice(source.lastIndexOf('/') + 1) : 'script',
    message: message as string,
    stack: error?.stack,
    file: source,
    detail: `lineno ${lineno || 0}`,
    url: window.location.href,
  });
}
