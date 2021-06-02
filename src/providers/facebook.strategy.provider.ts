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
import { UserIdentityService, UserService } from '../services';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TDone = (error: any, user?: any, options?: any) => void;

@injectable.provider({ scope: BindingScope.SINGLETON })
export class FacebookStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@service(UserIdentityService)
		private readonly userIdentityService: UserIdentityService,
		@service(UserService)
		private readonly userService: UserService,

		@inject(PassportBindings.FACEBOOK_STRATEGY_OPTIONS)
		private readonly strategyOptions: StrategyOptions,
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
					.then(this.userService.formAuthUser.bind(this.userService))
					.then((authUser) => done(null, authUser))
					.catch((error: Error) => done(error));
			},
		);
	}

	value() {
		return this.strategy;
	}
}
