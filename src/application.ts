import path from 'path';

import {
	AuthenticationBindings,
	AuthenticationComponent,
	registerAuthenticationStrategy,
} from '@loopback/authentication';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, composeInterceptors } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication, RestBindings, toInterceptor } from '@loopback/rest';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import passport from 'passport';
import { StrategyOption as FacebookStrategyOptions } from 'passport-facebook';
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth20';

import { PROJECT_NAME_DEFAULT } from './constants';
import {
	ApplicationBindings,
	DataSourcesBindings,
	PassportBindings,
} from './keys';
import {
	FacebookInterceptor,
	FacebookStrategyProvider,
	GoogleInterceptor,
	GoogleStrategyProvider,
	JwtStrategyProvider,
	LocalStrategyProvider,
	UserInterceptor,
} from './providers';
import { MySequence } from './sequence';
import {
	FacebookAuthentication,
	GoogleAuthentication,
	JwtAuthentication,
	LocalAuthentication,
	formUserProfile,
} from './services';
import { ILoopbackAuthPassportApplicationConfig } from './types';
import { SECURITY_SCHEMES } from './utils';

export { ApplicationConfig };

export class LoopbackAuthPassportApplication extends BootMixin(
	ServiceMixin(RepositoryMixin(RestApplication)),
) {
	constructor(options: ILoopbackAuthPassportApplicationConfig = {}) {
		super(options);

		// Set up the custom sequence
		this.sequence(MySequence);

		// Set up default home page
		this.static('/', path.join(__dirname, '../public'));

		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
		});
		this.component(RestExplorerComponent);

		this.projectRoot = __dirname;
		this.bootOptions = {
			controllers: {
				dirs: ['controllers'],
				extensions: ['.controller.js'],
				nested: true,
			},
			repositories: {
				dirs: ['repositories'],
				extensions: ['.repository.js'],
				nested: true,
			},
		};

		this.api({
			openapi: '3.0.0',
			info: { title: 'Loopback Auth Passport', version: '0.0.1' },
			paths: {},
			components: { securitySchemes: SECURITY_SCHEMES },
			servers: [{ url: '/' }],
		});

		this.bind(ApplicationBindings.PROJECT_NAME).to(
			options.application?.projectName ?? PROJECT_NAME_DEFAULT,
		);
		this.bind(ApplicationBindings.JWT_SERVICE_OPTIONS).to(options.jwt);
		this.bind(RestBindings.ERROR_WRITER_OPTIONS).to(
			options.rest?.errorWriterOptions ?? {},
		);
		this.configure(DataSourcesBindings.KV_REDIS).to(
			options.dataSource?.kvRedis,
		);

		// Authentication
		this.component(AuthenticationComponent);
		this.bind(AuthenticationBindings.USER_PROFILE_FACTORY).to(
			formUserProfile,
		);

		// Passport
		passport.serializeUser((user: unknown, done) => done(null, user));
		passport.deserializeUser((user: never, done) => done(null, user));

		this.bind(PassportBindings.PASSPORT_INIT_INTERCEPTOR).to(
			toInterceptor(passport.initialize()),
		);
		this.bind(PassportBindings.USER_INTERCEPTOR).toProvider(
			UserInterceptor,
		);

		// Local
		this.bind(PassportBindings.LOCAL_STRATEGY).toProvider(
			LocalStrategyProvider,
		);

		// Jwt
		this.bind(PassportBindings.JWT_STRATEGY_OPTIONS).to({
			secretOrKey: options.jwt?.accessTokenSecret,
			issuer: options.jwt?.accessTokenIssuer,
		});
		this.bind(PassportBindings.JWT_STRATEGY).toProvider(
			JwtStrategyProvider,
		);

		// Google
		this.bind(PassportBindings.GOOGLE_STRATEGY_OPTIONS).to(
			options.oauth2Providers?.google ?? ({} as GoogleStrategyOptions),
		);
		this.bind(PassportBindings.GOOGLE_STRATEGY).toProvider(
			GoogleStrategyProvider,
		);
		this.bind(PassportBindings.GOOGLE_INTERCEPTOR).toProvider(
			GoogleInterceptor,
		);
		this.bind(PassportBindings.GOOGLE_CALLBACK_INTERCEPTOR).to(
			composeInterceptors(
				PassportBindings.PASSPORT_INIT_INTERCEPTOR,
				PassportBindings.GOOGLE_INTERCEPTOR,
				PassportBindings.USER_INTERCEPTOR,
			),
		);

		// Facebook
		this.bind(PassportBindings.FACEBOOK_STRATEGY_OPTIONS).to(
			options.oauth2Providers?.facebook ??
				({} as FacebookStrategyOptions),
		);
		this.bind(PassportBindings.FACEBOOK_STRATEGY).toProvider(
			FacebookStrategyProvider,
		);
		this.bind(PassportBindings.FACEBOOK_INTERCEPTOR).toProvider(
			FacebookInterceptor,
		);
		this.bind(PassportBindings.FACEBOOK_CALLBACK_INTERCEPTOR).to(
			composeInterceptors(
				PassportBindings.PASSPORT_INIT_INTERCEPTOR,
				PassportBindings.FACEBOOK_INTERCEPTOR,
				PassportBindings.USER_INTERCEPTOR,
			),
		);

		registerAuthenticationStrategy(this, LocalAuthentication);
		registerAuthenticationStrategy(this, JwtAuthentication);
		registerAuthenticationStrategy(this, GoogleAuthentication);
		registerAuthenticationStrategy(this, FacebookAuthentication);
	}
}
