import { BindingScope, Provider, inject, injectable } from '@loopback/core';
import { ExpressRequestHandler } from '@loopback/rest';
import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

@injectable.provider({ scope: BindingScope.SINGLETON })
export class GoogleStrategyMiddlewareProvider
	implements Provider<ExpressRequestHandler>
{
	constructor(
		@inject('googleStrategy')
		public strategy: GoogleStrategy,
	) {
		passport.use(this.strategy);
	}

	value() {
		// return passport.authenticate('google') as ExpressRequestHandler;
		return passport.authenticate(
			this.strategy.name,
		) as ExpressRequestHandler;
	}
}
