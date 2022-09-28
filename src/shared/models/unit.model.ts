import type { EntityID, JsonParser, StaticStatus } from '@/types';
import { Parse } from '@/shared/network/parse';
import { UnitType } from '@/shared/enums/status.enum';

export class Unit {
  constructor(
    public id: EntityID,
    public title: string,
    public alias: string,
    public type: StaticStatus,
  ) {}

  static fromJson: JsonParser<Unit> = (json) => {
    return new Unit(
      Parse.number(json.id),
      Parse.string(json.title),
      Parse.string(json.alias),
      Parse.requiredStatus(UnitType, json.type.id),
    );
  };
}
