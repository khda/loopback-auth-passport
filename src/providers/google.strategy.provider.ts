import {
	BindingScope,
	Provider,
	inject,
	injectable,
	service,
} from '@loopback/core';
import { Profile as PassportProfile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth2';

import { PassportBindings } from '../keys';
import { UserIdentityService } from '../services';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TDone = (error: any, user?: any, options?: any) => void;

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
