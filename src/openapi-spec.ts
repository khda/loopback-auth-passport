import { ApplicationConfig } from '@loopback/core';

import { LoopbackAuthPassportApplication } from './application';

const PORT_DEFAULT = 3000;

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
	const config: ApplicationConfig = {
		rest: {
			port: Number(process.env.PORT ?? PORT_DEFAULT),
			host: process.env.HOST ?? 'localhost',
		},
	};
	const outFile = process.argv[2] ?? '';
	const app = new LoopbackAuthPassportApplication(config);
	await app.boot();
	await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch((err) => {
	console.error('Fail to export OpenAPI spec from the application.', err);
	process.exit(1);
});
