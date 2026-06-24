import { Role } from '@prisma/client';

export interface ActiveUser {
  id: number;
  agencyId: number | undefined;
  role: Role;
}
