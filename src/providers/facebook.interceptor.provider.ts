import { Interceptor, Provider, inject } from '@loopback/core';
import { toInterceptor } from '@loopback/rest';
import passport from 'passport';
import { Strategy } from 'passport-facebook';

import { PassportBindings } from '../keys';

export class FacebookInterceptor implements Provider<Interceptor> {
	private readonly interceptor: Interceptor;

	constructor(
		@inject(PassportBindings.FACEBOOK_STRATEGY)
		private readonly strategy: Strategy,
	) {
		this.interceptor = toInterceptor(
			passport.use(this.strategy).authenticate(this.strategy.name),
		);
	}

	value() {
		return this.interceptor;
	}
}
