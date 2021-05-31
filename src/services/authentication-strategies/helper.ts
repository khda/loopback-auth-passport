import { Principal, securityId } from '@loopback/security';

import { User } from '../../models';

export const formUserProfile = (user: User): User & Principal =>
	Object.assign(user, { [securityId]: String(user.id) });
