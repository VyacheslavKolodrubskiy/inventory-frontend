import { toString } from '@qlt2020/frutils';
import { i18n } from '@/i18n';

export const enum ErrorLevel {
  Unexpected = 1,
  Bug = 2,
  Critical = 3,
  Fatal = 4,
}

export class BaseError extends Error {
  constructor(
    public message: string,
    public description?: string,
    public level = ErrorLevel.Bug,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ParseError extends BaseError {
  constructor(private expectedType: string, private gotType: unknown) {
    super(
      i18n.t('common.parseError'),
      `${expectedType} expected, got ${toString.call(gotType)}`,
      ErrorLevel.Fatal,
    );
  }
}

