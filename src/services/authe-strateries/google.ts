import {
	AuthenticationStrategy,
	asAuthStrategy,
} from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { extensionFor, inject, injectable } from '@loopback/core';
import { RedirectRoute, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { Strategy } from 'passport-google-oauth2';

import { User } from '../../models';

import { PassportAuthenticationBindings, formUserProfile } from './types';

export const OAUTH2_GOOGLE_AUTHE_STRATEGY_NAME = 'oauth2-google';

@injectable(
	asAuthStrategy,
	extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY),
)
export class GoogleOauth2Authentication implements AuthenticationStrategy {
	public readonly name = OAUTH2_GOOGLE_AUTHE_STRATEGY_NAME;
	private readonly strategy: StrategyAdapter<User>;

	constructor(
		@inject('googleStrategy')
		public passportStrategy: Strategy,
	) {
		this.strategy = new StrategyAdapter(
			this.passportStrategy,
			this.name,
			formUserProfile.bind(this),
		);
	}

	/**
	 *
	 */
	async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
		return this.strategy.authenticate(request);
	}
}
