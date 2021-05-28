import path from 'path';

import {
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
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth2';

import { PROJECT_NAME_DEFAULT } from './constants';
import { ApplicationBindings, PassportBindings } from './keys';
import {
	GoogleInterceptor,
	GoogleStrategyProvider,
	UserInterceptor,
} from './providers';
import { MySequence } from './sequence';
import { GoogleAuthentication } from './services';
import { ILoopbackAuthPassportApplicationConfig } from './types';

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

		// Authentication
		this.component(AuthenticationComponent);
		registerAuthenticationStrategy(this, GoogleAuthentication);

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
			servers: [{ url: '/' }],
		});

		this.bind(ApplicationBindings.PROJECT_NAME).to(
			options.application?.projectName ?? PROJECT_NAME_DEFAULT,
		);
		this.bind(RestBindings.ERROR_WRITER_OPTIONS).to(
			options.rest?.errorWriterOptions ?? {},
		);

		// Passport
		passport.serializeUser((user: unknown, done) => done(null, user));
		passport.deserializeUser((user: never, done) => done(null, user));

		this.bind(PassportBindings.GOOGLE_STRATEGY_OPTIONS).to(
			options.oauth2Providers?.google ?? ({} as GoogleStrategyOptions),
		);
		this.bind(PassportBindings.GOOGLE_STRATEGY).toProvider(
			GoogleStrategyProvider,
		);
		this.bind(PassportBindings.PASSPORT_INIT_INTERCEPTOR).to(
			toInterceptor(passport.initialize()),
		);

		this.bind(PassportBindings.GOOGLE_INTERCEPTOR).toProvider(
			GoogleInterceptor,
		);
		this.bind(PassportBindings.USER_INTERCEPTOR).toProvider(
			UserInterceptor,
		);
		this.bind(PassportBindings.GOOGLE_CALLBACK_INTERCEPTOR).to(
			composeInterceptors(
				PassportBindings.PASSPORT_INIT_INTERCEPTOR,
				PassportBindings.GOOGLE_INTERCEPTOR,
				PassportBindings.USER_INTERCEPTOR,
			),
		);
	}
}
