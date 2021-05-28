import { ApplicationConfig } from '@loopback/core';
import { ErrorWriterOptions, RestServerConfig } from '@loopback/rest';
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth2';

export interface ILoopbackAuthPassportApplicationConfig
	extends ApplicationConfig {
	application?: { projectName?: string };
	rest?: RestServerConfig & { errorWriterOptions?: ErrorWriterOptions };
	oauth2Providers?: { google?: GoogleStrategyOptions };
}
