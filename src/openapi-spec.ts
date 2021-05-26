import { ApplicationConfig } from '@loopback/core';

import { LoopbackAuthPassportApplication } from './application';
import { HOST_DEFAULT, PORT_DEFAULT } from './constants';

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
	const config: ApplicationConfig = {
		rest: {
			port: Number(process.env.REST_PORT ?? PORT_DEFAULT),
			host: process.env.REST_HOST ?? HOST_DEFAULT,
		},
	};
	const outFile = process.argv[2] ?? '';
	const app = new LoopbackAuthPassportApplication(config);

	await app.boot();
	await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch((error) => {
	console.error('Fail to export OpenAPI spec from the application.', error);
	process.exit(1);
});
