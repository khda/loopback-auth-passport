import { Interceptor, Provider, inject } from '@loopback/core';
import { toInterceptor } from '@loopback/rest';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

import { PassportBindings } from '../keys';

export class GoogleInterceptor implements Provider<Interceptor> {
	private readonly interceptor: Interceptor;

	constructor(
		@inject(PassportBindings.GOOGLE_STRATEGY)
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
