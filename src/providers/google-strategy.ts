import {
	BindingScope,
	Provider,
	inject,
	injectable,
	service,
} from '@loopback/core';
import { Strategy, StrategyOptions } from 'passport-google-oauth2';

import { UserIdentityService } from '../services';
import { verifyFunctionFactory } from '../services/authe-strateries';

@injectable.provider({ scope: BindingScope.SINGLETON })
export class GoogleStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@inject('googleOAuth2Options')
		private readonly oauth2Options: StrategyOptions,
		@service(UserIdentityService)
		private readonly userIdentityService: UserIdentityService,
	) {
		this.strategy = new Strategy(
			this.oauth2Options,
			verifyFunctionFactory(this.userIdentityService),
		);
	}

	value() {
		return this.strategy;
	}
}
