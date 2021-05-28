import {
	BindingScope,
	Provider,
	inject,
	injectable,
	service,
} from '@loopback/core';
import { Profile as PassportProfile } from 'passport';
import { Strategy, StrategyOption as StrategyOptions } from 'passport-facebook';

import { PassportBindings } from '../keys';
import { UserIdentityService } from '../services';
import { TDone } from '../types';

@injectable.provider({ scope: BindingScope.SINGLETON })
export class FacebookStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@inject(PassportBindings.FACEBOOK_STRATEGY_OPTIONS)
		private readonly strategyOptions: StrategyOptions,
		@service(UserIdentityService)
		private readonly userIdentityService: UserIdentityService,
	) {
		this.strategy = new Strategy(
			this.strategyOptions,
			(
				accessToken: string,
				refreshToken: string,
				profile: PassportProfile,
				done: TDone,
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
