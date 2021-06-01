import { ApplicationConfig } from '@loopback/core';
import { ErrorWriterOptions, RestServerConfig } from '@loopback/rest';
import { StrategyOption as FacebookStrategyOptions } from 'passport-facebook';
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth20';

export interface ILoopbackAuthPassportApplicationConfig
	extends ApplicationConfig {
	application?: { projectName?: string };
	rest?: RestServerConfig & { errorWriterOptions?: ErrorWriterOptions };
	oauth2Providers?: {
		google?: GoogleStrategyOptions;
		facebook?: FacebookStrategyOptions & { scope?: string | string[] };
	};
}
