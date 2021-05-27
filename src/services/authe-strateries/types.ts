import { UserIdentityService as IUIService } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { Profile as PassportProfile } from 'passport';

import { User } from '../../models';

export namespace PassportAuthenticationBindings {
	export const OAUTH2_STRATEGY = 'passport.authentication.oauth2.strategy';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TDone = (error: any, user?: any, options?: any) => void;

/**
 *
 */
export type VerifyFunction = (
	accessToken: string,
	refreshToken: string,
	profile: PassportProfile,
	done: TDone,
) => void;

/**
 *
 */
export const verifyFunctionFactory =
	(userService: IUIService<PassportProfile, User>): VerifyFunction =>
	(
		accessToken: string,
		refreshToken: string,
		profile: PassportProfile,
		done: TDone,
	) => {
		userService
			.findOrCreateUser(profile)
			.then((user) => done(null, user))
			.catch((error: Error) => done(error));
	};

/**
 *
 */
export const formUserProfile = (user: User): UserProfile => ({
	[securityId]: String(user.id),
	...user,
});
