import { BindingKey, Interceptor } from '@loopback/core';
import {
	Strategy as FacebookStrategy,
	StrategyOption as FacebookStrategyOptions,
} from 'passport-facebook';
import {
	Strategy as GoogleStrategy,
	StrategyOptions as GoogleStrategyOptions,
} from 'passport-google-oauth2';
import { Strategy as LocalStrategy } from 'passport-local';

export namespace ApplicationBindings {
	export const PROJECT_NAME = BindingKey.create<string>(
		'application.projectName',
	);
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
