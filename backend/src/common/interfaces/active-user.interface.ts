import { Role } from 'generated/prisma/enums';

export interface ActiveUser {
  id: number;
  agencyId: number | undefined;
  role: Role;
}
