import {
	BindingScope,
	Provider,
	inject,
	injectable,
	service,
} from '@loopback/core';
import { Profile as PassportProfile } from 'passport';
import {
	GoogleCallbackParameters,
	Strategy,
	StrategyOptions,
	VerifyCallback,
} from 'passport-google-oauth20';

import { PassportBindings } from '../keys';
import { UserIdentityService } from '../services';

@injectable.provider({ scope: BindingScope.SINGLETON })
export class GoogleStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@inject(PassportBindings.GOOGLE_STRATEGY_OPTIONS)
		private readonly strategyOptions: StrategyOptions,
		@service(UserIdentityService)
		private readonly userIdentityService: UserIdentityService,
	) {
		this.strategy = new Strategy(
			this.strategyOptions,
			(
				accessToken: string,
				refreshToken: string,
				params: GoogleCallbackParameters,
				profile: PassportProfile,
				done: VerifyCallback,
			) => {
				this.userIdentityService
					.findOrCreateUser(profile)
					.then((user) => done(null, user))
					.catch((error: Error) => done(error));
			},
		);
	}

	value() {
		return this.strategy;
	}
}
