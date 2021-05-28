import { BindingKey, Interceptor } from '@loopback/core';
import {
	Strategy as GoogleStrategy,
	StrategyOptions as GoogleStrategyOptions,
} from 'passport-google-oauth2';

export namespace ApplicationBindings {
	export const PROJECT_NAME = BindingKey.create<string>(
		'application.projectName',
	);
}

export namespace PassportBindings {
	export const GOOGLE_STRATEGY_OPTIONS =
		BindingKey.create<GoogleStrategyOptions>(
			'authentication.googleStrategyOptions',
		);
	export const GOOGLE_STRATEGY = BindingKey.create<GoogleStrategy>(
		'authentication.googleStrategy',
	);
	export const PASSPORT_INIT_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.PassportInitInterceptor',
	);
	export const GOOGLE_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.GoogleInterceptor',
	);
	export const USER_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.UserInterceptor',
	);
	export const GOOGLE_CALLBACK_INTERCEPTOR = BindingKey.create<Interceptor>(
		'authentication.GoogleCallbackInterceptor',
	);
}
