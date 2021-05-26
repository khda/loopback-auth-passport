import { ApplicationConfig } from '@loopback/core';
import { ErrorWriterOptions, RestServerConfig } from '@loopback/rest';

export interface ILoopbackAuthPassportApplicationConfig
	extends ApplicationConfig {
	application?: { projectName?: string };
	rest?: RestServerConfig & { errorWriterOptions?: ErrorWriterOptions };
}
