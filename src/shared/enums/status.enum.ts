import type { Recordable } from '@qlt2020/frutils';
import { objectKeys } from '@qlt2020/frutils';
import type { StaticStatus } from '@/types';

export const DocumentStatus = {
  Created: { id: 0, title: 'statuses.draft', color: 'gray' },
  SentToTerminal: { id: 1, title: 'statuses.sentToTerminal', color: 'orange' },
  Completed: { id: 2, title: 'statuses.completed', color: 'green' },
};

export const MovementType = {
  Receive: { id: 1, title: 'statuses.receive', color: 'purple' },
  Relocation: { id: 2, title: 'statuses.relocation', color: 'cyan' },
  WriteOff: { id: 3, title: 'statuses.writeOff', color: 'orange' },
};

export const DocumentType = {
  Receive: { id: 1, title: 'statuses.receive', color: 'purple' },
  Relocation: { id: 2, title: 'statuses.relocation', color: 'cyan' },
  WriteOff: { id: 3, title: 'statuses.writeOff', color: 'orange' },
  Marking: { id: 4, title: 'statuses.marking', color: 'blue' },
  Inventory: { id: 5, title: 'statuses.inventory', color: 'green' },
};

export const WriteOffType = {
  Manually: { id: 0, title: 'statuses.manuallyWriteOff', color: 'purple' },
  Automatic: { id: 1, title: 'statuses.automaticWriteOff', color: 'cyan' },
};

export const DocumentProductStatus = {
  Created: { id: 0, title: 'common.created[0]', color: 'gray' },
  ConfirmedWithTerminal: { id: 1, title: 'statuses.confirmedWithTerminal', color: 'blue' },
  ConfirmedManually: { id: 2, title: 'statuses.confirmedManually', color: 'cyan' },
  NotConfirmed: { id: 3, title: 'statuses.notConfirmed', color: 'orange' },
};

export const ProductMarkingStatus = {
  Unmarked: { id: 0, title: 'statuses.hasNoCode', color: 'orange' },
  Marked: { id: 1, title: 'statuses.hasCode', color: 'blue' },
};

export const UnitType = {
  Countable: { id: 1, title: 'statuses.countable', color: 'purple' },
  Uncountable: { id: 2, title: 'statuses.uncountable', color: 'blue' },
};

export const UserStatus = {
  Active: { id: 1, title: 'statuses.active', color: 'green' },
  Inactive: { id: 0, title: 'statuses.inactive', color: 'default' },
};

export class StatusUtils {
  static get(statuses: Recordable<StaticStatus>, id: number) {
    const foundKey = objectKeys(statuses).find(key => statuses[key].id === id);
    return foundKey ? statuses[foundKey] : undefined;
  }
}
