import { ApplicationConfig } from '@loopback/core';
import { ErrorWriterOptions, RestServerConfig } from '@loopback/rest';
import { StrategyOption as FacebookStrategyOptions } from 'passport-facebook';
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth20';

import { IJwtServiceOptions } from './services';

export type TKvRedisConnector = 'loopback-connector-kv-redis' | 'kv-redis';

export interface IKvRedisDataSourceConfig {
	name?: string;
	connector: TKvRedisConnector;
	url?: string;
	host?: string;
	port?: number;
	password?: string;
	db?: string;
}

export interface ILoopbackAuthPassportApplicationConfig
	extends ApplicationConfig {
	application?: { projectName?: string };
	rest?: RestServerConfig & { errorWriterOptions?: ErrorWriterOptions };
	dataSource?: { kvRedis?: IKvRedisDataSourceConfig };
	jwt?: IJwtServiceOptions;
	oauth2Providers?: {
		google?: GoogleStrategyOptions;
		facebook?: FacebookStrategyOptions & { scope?: string | string[] };
	};
}
