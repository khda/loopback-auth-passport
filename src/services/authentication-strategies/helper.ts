import { UserProfile, securityId } from '@loopback/security';

import { AuthUser } from '../../models';

export const formUserProfile = (authUser: AuthUser): AuthUser & UserProfile =>
	Object.assign(authUser, { [securityId]: String(authUser.id) });
