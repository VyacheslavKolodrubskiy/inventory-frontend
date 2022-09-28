import type { EntityID, JsonParser } from '@/types';
import { Parse } from '@/shared/network/parse';

export class Status {
  constructor(
    public id: EntityID,
    public title: string,
  ) {}

  static fromJson: JsonParser<Status> = (json) => {
    return new Status(
      Parse.number(json.id),
      Parse.string(json.title),
    );
  };
}

