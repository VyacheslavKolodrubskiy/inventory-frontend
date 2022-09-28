import type { User } from '@/shared/models/user.model';
import type { DateFormat, EntityID, StaticStatus } from '@/types';

export abstract class BaseMovement {
  abstract id: EntityID;
  abstract title: string;
  abstract createdDate: DateFormat;
  abstract status: StaticStatus;
  abstract author: User;
  abstract responsibleEmployee: User;
  abstract description?: string;
}
