import { BindingScope, Provider, inject, injectable } from '@loopback/core';
import {
	ExtractJwt,
	Strategy,
	StrategyOptions,
	VerifiedCallback,
} from 'passport-jwt';

import { PassportBindings } from '../keys';
import { AuthUser } from '../models';

@injectable.provider({ scope: BindingScope.SINGLETON })
export class JwtStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@inject(PassportBindings.JWT_STRATEGY_OPTIONS)
		private readonly strategyOptions: StrategyOptions,
	) {
		strategyOptions.jwtFromRequest =
			ExtractJwt.fromAuthHeaderAsBearerToken();

		this.strategy = new Strategy(
			strategyOptions,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(payload: any, done: VerifiedCallback) => {
				done(null, new AuthUser(payload));
			},
		);
	}

	value() {
		return this.strategy;
	}
}
