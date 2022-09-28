import { Parse } from '../network/parse';
import type { EntityID, JsonParser } from '@/types';

export class BaseImage {
  constructor(
    public id: EntityID,
    public url: string,
  ) {}

  static fromJson: JsonParser<BaseImage> = (json) => {
    return new BaseImage(
      Parse.number(json.id),
      Parse.string(json.url),
    );
  };
}
