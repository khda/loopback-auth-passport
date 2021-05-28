import { AuthenticationStrategy } from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { inject } from '@loopback/core';
import { RedirectRoute, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Strategy } from 'passport-google-oauth2';

import { PassportBindings } from '../../keys';
import { User } from '../../models';

import { formUserProfile } from './helper';

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
	) {
		this.strategyAdapter = new StrategyAdapter(
			this.strategy,
			this.name,
			formUserProfile.bind(this),
		);
	}

	/**
	 *
	 */
	async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
		return this.strategyAdapter.authenticate(request);
	}
}
