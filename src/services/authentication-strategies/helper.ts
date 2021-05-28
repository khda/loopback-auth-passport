import { UserProfile, securityId } from '@loopback/security';

import { User } from '../../models';

export const formUserProfile = (user: User): UserProfile => ({
	[securityId]: String(user.id),
	...user,
});
