import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { ROLES_KEY } from './auth.constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Organizer = () => Roles(Role.ORGANIZER);
export const Traveler = () => Roles(Role.TRAVELER);
export const All = () => Roles(Role.ORGANIZER, Role.TRAVELER);
