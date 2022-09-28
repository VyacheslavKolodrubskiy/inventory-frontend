import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface';
import { version } from '../../../package.json';

export const APP_VERSION = version;

export const DEFAULT_HEADER_THEME = 'light';
export const DEFAULT_SIDEBAR_THEME = 'dark';

export const MODAL_URL_PREFIX = 'm';

export const SIDEBAR_MENU_WIDTH = 210;
export const SIDEBAR_COLLAPSED_WIDTH = 50;

export const INPUT_DEBOUNCE_DELAY = 500;
export const TABLE_MAX_UPDATE_RATE = 3000;

export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_SELECT_PER_PAGE = 10;

export const QUANTITY_PRECISION = 3;

export const DEFAULT_MAP_POINT = [51.128207, 71.43042];

export const enum MaxAmount {
  UncountableProducts = 999998,
  ReceiveProducts = 499,
  InitialSearchItems = 50,
}

// Unit: kilobytes
export const enum MaxFileSize {
  ProductAvatar = 2000,
  ProductImport = 100,
  ReceiveImport = 2000,
}

export const enum AcceptList {
  File = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png,.jpeg,.gif,.mp4',
  Image = '.jpg,.png,.jpeg,.gif',
  Spreadsheet = '.xlsx',
}

// Format of the dates that we want see on pages
export const enum DisplayFormat {
  DateTime = 'DD.MM.YYYY HH:mm',
  DateTimeFull = 'D MMMM YYYY HH:mm',
  Date = 'DD.MM.YYYY',
  DateFull = 'D MMMM YYYY',
  Time = 'HH:mm',
}

// Format of the dates that we send to the backend
export const enum DatePickerValueFormat {
  Date = 'YYYY-MM-DD',
  DateTime = 'YYYY-MM-DDTHH:mm:ss',
}

// Format of the dates that are displayed in the input
export const DatePickerFormat: Record<Capitalize<PickerMode>, string> = Object.freeze({
  Date: 'DD.MM.YYYY',
  Year: 'YYYY',
  Quarter: 'QQ YYYY',
  Month: 'MM.YYYY',
  Week: 'wo YYYY',
  Time: 'HH:mm',
});
