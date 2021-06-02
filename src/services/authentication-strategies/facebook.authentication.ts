import {
	AuthenticationBindings,
	AuthenticationStrategy,
	UserProfileFactory,
} from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { inject } from '@loopback/core';
import { RedirectRoute, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Strategy } from 'passport-facebook';

import { PassportBindings } from '../../keys';
import { AuthUser } from '../../models';

export const FACEBOOK_AUTHENTICATION_STRATEGY_NAME = 'facebook';

/**
 *
 */
export class FacebookAuthentication implements AuthenticationStrategy {
	public readonly name = FACEBOOK_AUTHENTICATION_STRATEGY_NAME;
	private readonly strategyAdapter: StrategyAdapter<AuthUser>;

	constructor(
		@inject(PassportBindings.FACEBOOK_STRATEGY)
		private readonly strategy: Strategy,
		@inject(AuthenticationBindings.USER_PROFILE_FACTORY)
		private readonly userProfileFactory: UserProfileFactory<AuthUser>,
	) {
		this.strategyAdapter = new StrategyAdapter(
			this.strategy,
			this.name,
			this.userProfileFactory,
		);
	}

	/**
	 *
	 */
	async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
		return this.strategyAdapter.authenticate(request);
	}
}
