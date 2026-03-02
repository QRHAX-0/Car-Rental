import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';

export const RolesKey = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);
