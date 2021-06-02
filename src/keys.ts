import { BindingKey, Interceptor } from '@loopback/core';
import { juggler } from '@loopback/repository';
import {
	Strategy as FacebookStrategy,
	StrategyOption as FacebookStrategyOptions,
} from 'passport-facebook';
import {
	Strategy as GoogleStrategy,
	StrategyOptions as GoogleStrategyOptions,
} from 'passport-google-oauth20';
import {
	Strategy as JwtStrategy,
	StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { IJwtServiceOptions } from './services';

export namespace ApplicationBindings {
	export const PROJECT_NAME = BindingKey.create<string>(
		'application.projectName',
	);

	export const JWT_SERVICE_OPTIONS = BindingKey.create<
		IJwtServiceOptions | undefined
	>('authentication.jwtServiceOptions');
}

export namespace PassportBindings {
	export const PASSPORT_INIT_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.PassportInitInterceptor',
	);
	export const USER_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.UserInterceptor',
	);

	// Local
	export const LOCAL_STRATEGY = BindingKey.create<LocalStrategy>(
		'authentication.localStrategy',
	);

	// Jwt
	export const JWT_STRATEGY_OPTIONS = BindingKey.create<
		Omit<JwtStrategyOptions, 'jwtFromRequest'>
	>('authentication.jwtStrategyOptions');
	export const JWT_STRATEGY = BindingKey.create<JwtStrategy>(
		'authentication.jwtStrategy',
	);

	// Google
	export const GOOGLE_STRATEGY_OPTIONS =
		BindingKey.create<GoogleStrategyOptions>(
			'authentication.googleStrategyOptions',
		);
	export const GOOGLE_STRATEGY = BindingKey.create<GoogleStrategy>(
		'authentication.googleStrategy',
	);
	export const GOOGLE_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.GoogleInterceptor',
	);
	export const GOOGLE_CALLBACK_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.GoogleCallbackInterceptor',
	);

	// Facebook
	export const FACEBOOK_STRATEGY_OPTIONS =
		BindingKey.create<FacebookStrategyOptions>(
			'authentication.facebookStrategyOptions',
		);
	export const FACEBOOK_STRATEGY = BindingKey.create<FacebookStrategy>(
		'authentication.facebookStrategy',
	);
	export const FACEBOOK_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.FacebookInterceptor',
	);
	export const FACEBOOK_CALLBACK_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.FacebookCallbackInterceptor',
	);
}

export namespace DataSourcesBindings {
	export const KV_REDIS =
		BindingKey.create<juggler.DataSource>('datasources.Redis');
}
