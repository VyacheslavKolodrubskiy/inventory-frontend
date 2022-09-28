import { Parse } from '../network/parse';
import type { JsonParser } from '@/types';

export class ProductStatusCount {
  constructor(
    public total: number,
    public created: number,
    public confirmedWithTerminal: number,
    public confirmedManually: number,
    public notConfirmed: number,
  ) {}

  static fromJson: JsonParser<ProductStatusCount> = (json) => {
    return new ProductStatusCount(
      Parse.number(json.all),
      Parse.number(json.created),
      Parse.number(json.approved),
      Parse.number(json.approvedManually),
      Parse.number(json.declined),
    );
  };
}
