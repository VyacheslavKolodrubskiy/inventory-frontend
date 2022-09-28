import dayjs from 'dayjs';
import type { Recordable } from '@qlt2020/frutils';
import {
  inRange,
  isArray,
  isBoolean,
  isNaN,
  isNumber,
  isObject,
  isString,
  toNumber,
} from '@qlt2020/frutils';
import { mask } from 'maska';
import { StatusUtils } from '../enums/status.enum';
import type { Coordinates, JsonParser, StaticStatus } from '@/types';
import { ParseError } from '@/shared/utils/errors';

export abstract class Parse {
  static date(input: unknown) {
    if (input && isString(input)) {
      const dayjsFormat = dayjs(input);
      return dayjsFormat.isValid() ? dayjsFormat : undefined;
    }

    return undefined;
  }

  static requiredDate(input: unknown) {
    const parsed = Parse.date(input);
    if (!parsed)
      throw new ParseError('Valid date string', input);

    return parsed;
  }

  static baseParseNumber(input: unknown) {
    if (input != null) {
      if (isString(input))
        return isNaN(+input) ? null : +input;

      if (isNumber(input))
        return input;
    }

    return null;
  }

  static number(input: unknown, { defaultValue = 0 } = {}) {
    return Parse.baseParseNumber(input) ?? defaultValue;
  }

  static requiredNumber(input: unknown) {
    const parsed = Parse.baseParseNumber(input);

    if (parsed == null)
      throw new ParseError('Number', parsed);

    return parsed;
  }

  static requiredSortOfNumber(input: unknown, sortOf: number[]) {
    const parsed = Parse.baseParseNumber(input);

    if (parsed == null || !sortOf.includes(parsed))
      throw new ParseError(`One of ${sortOf}`, parsed);

    return parsed;
  }

  static boolean(input: unknown, { defaultValue = false } = {}) {
    if (isBoolean(input))
      return input;

    if (isNumber(input))
      return input > 0;

    if (isString(input))
      return input === 'true';

    return defaultValue;
  }

  static string(input: unknown, { defaultValue = '' } = {}) {
    if (isString(input))
      return input;

    if (input == null)
      return defaultValue;

    return `${input}`;
  }

  static object<T>(input: unknown, converter: JsonParser<T>) {
    return isObject(input) ? converter(input) : undefined;
  }

  static requiredObject<T>(input: unknown, converter: JsonParser<T>) {
    const parsed = Parse.object(input, converter);
    if (!parsed)
      throw new ParseError('Object', input);

    return parsed;
  }

  static objectList<T>(input: unknown, converter: JsonParser<T>) {
    if (!isArray<T>(input))
      return [];

    return input
      .map(it => isObject(it) ? converter(it) : null)
      .filter<T>((it): it is T => !!it);
  }

  static coordinates(input: unknown, { defaultValue = [] } = {}) {
    if (!isString(input))
      return defaultValue as unknown as Coordinates;

    // Trim parentheses (51.1478616,71.3389648)
    const location = input.slice(1, -1);
    const parsed = location.split(',').map(el => toNumber(el));
    const [latitude, longitude] = parsed;

    if (
      parsed.length !== 2
      || parsed.includes(0)
      || !inRange(latitude, -90, 90)
      || !inRange(longitude, -180, 180)
    )
      return defaultValue as unknown as Coordinates;

    return [latitude, longitude] as Coordinates;
  }

  static status(statuses: Recordable<StaticStatus>, id?: number) {
    return isNumber(id) ? StatusUtils.get(statuses, id) : undefined;
  }

  static requiredStatus(statuses: Recordable<StaticStatus>, id?: number) {
    const parsed = Parse.status(statuses, id);
    if (!parsed)
      throw new ParseError('Existing status id', parsed);

    return parsed;
  }

  // Need to format all incoming phones for correct display in tables
  static phone(input: unknown) {
    return mask(Parse.string(input), '+7 (###) ### ## ##', undefined);
  }
}
