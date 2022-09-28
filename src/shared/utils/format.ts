import dayjs from 'dayjs';
import type { TruncateOptions } from 'lodash';
import type { Nullable } from '@qlt2020/frutils';
import { formatMobilePhone, toNumber } from '@qlt2020/frutils';
import { truncate } from 'lodash-es';
import { DisplayFormat } from '@/shared/config/constants';
import { i18n } from '@/i18n';

export class Format {
  static num = (value: unknown) => toNumber(value).toString();
  static yesno = (value: boolean) => value ? i18n.t('common.yes') : i18n.t('common.no');
  static empty = (value: Nullable<string>, defaultValue = i18n.t('common.noData')) => value || defaultValue;
  static truncate = (value?: string, options?: TruncateOptions) => {
    return truncate(value, { length: 50, separator: '...', ...options });
  };

  static datetime = (value?: dayjs.ConfigType) => dayjs(value).format(DisplayFormat.DateTime);
  static datetimeFull = (value?: dayjs.ConfigType) => dayjs(value).format(DisplayFormat.DateTimeFull);
  static date = (value?: dayjs.ConfigType) => dayjs(value).format(DisplayFormat.Date);
  static dateFull = (value?: dayjs.ConfigType) => dayjs(value).format(DisplayFormat.DateFull);
  static time = (value?: dayjs.ConfigType) => dayjs(value).format(DisplayFormat.Time);

  static phone = formatMobilePhone;
}
