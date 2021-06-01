import {
	AuthenticationBindings,
	AuthenticationStrategy,
	UserProfileFactory,
} from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { inject } from '@loopback/core';
import { RedirectRoute, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Strategy } from 'passport-google-oauth20';

import { PassportBindings } from '../../keys';
import { User } from '../../models';

export const GOOGLE_AUTHENTICATION_STRATEGY_NAME = 'google';

/**
 *
 */
export class GoogleAuthentication implements AuthenticationStrategy {
	public readonly name = GOOGLE_AUTHENTICATION_STRATEGY_NAME;
	private readonly strategyAdapter: StrategyAdapter<User>;

	constructor(
		@inject(PassportBindings.GOOGLE_STRATEGY)
		private readonly strategy: Strategy,
		@inject(AuthenticationBindings.USER_PROFILE_FACTORY)
		userProfileFactory: UserProfileFactory<User>,
	) {
		this.strategyAdapter = new StrategyAdapter(
			this.strategy,
			this.name,
			userProfileFactory,
		);
	}

	/**
	 *
	 */
	async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
		return this.strategyAdapter.authenticate(request);
	}
}
