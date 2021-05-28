import * as dotenv from 'dotenv';

import { LoopbackAuthPassportApplication } from './application';
import {
	ERROR_SAFE_FIELDS,
	GRACE_PERIOD_FOR_CLOSE,
	HOST_DEFAULT,
	PORT_DEFAULT,
} from './constants';
import { ILoopbackAuthPassportApplicationConfig } from './types';

export * from './application';

export async function main(
	options: ILoopbackAuthPassportApplicationConfig = {},
) {
	const app = new LoopbackAuthPassportApplication(options);
	await app.boot();
	await app.start();

	const { url } = app.restServer;
	console.log(`Server is running at ${url}`);
	console.log(`Try ${url}/ping`);

	return app;
}

if (require.main === module) {
	dotenv.config();

	const config: ILoopbackAuthPassportApplicationConfig = {
		application: { projectName: process.env.PROJECT_NAME },
		rest: {
			host: process.env.REST_HOST ?? HOST_DEFAULT,
			port: Number(process.env.REST_PORT ?? PORT_DEFAULT),
			gracePeriodForClose: GRACE_PERIOD_FOR_CLOSE,
			openApiSpec: { setServersFromRequest: true },
			basePath: process.env.REST_BASE_PATH,
			errorWriterOptions: {
				debug: process.env.REST_DEBUG === 'true',
				safeFields: ERROR_SAFE_FIELDS,
			},
		},
		oauth2Providers: {
			google: {
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
				scope: JSON.parse(process.env.GOOGLE_SCOPE ?? '[]'),
			},
		},
	};

	main(config).catch((error) => {
		console.error('Cannot start the application.', error);
		process.exit(1);
	});
}
