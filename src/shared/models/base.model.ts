import { Parse } from '../network/parse';
import type { EntityID, JsonParser } from '@/types';

export class BaseEntity {
  constructor(
    public id: EntityID,
    public title: string,
  ) {}

  static fromJson: JsonParser<BaseEntity> = (json) => {
    return new BaseEntity(
      Parse.requiredNumber(json.id),
      Parse.string(json.title),
    );
  };
}
