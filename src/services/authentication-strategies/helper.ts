import { Principal, securityId } from '@loopback/security';

import { AuthUser } from '../../models';

export const formUserProfile = (authUser: AuthUser): AuthUser & Principal =>
	Object.assign(authUser, { [securityId]: String(authUser.id) });
