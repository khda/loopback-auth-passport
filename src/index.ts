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
		dataSource: {
			kvRedis: {
				name: 'KvRedis',
				connector: 'kv-redis',
				url: process.env.REDIS_URL,
				host: process.env.REDIS_HOST,
				port: process.env.REDIS_PORT
					? Number(process.env.REDIS_PORT)
					: undefined,
				password: process.env.REDIS_PASSWORD,
				db: process.env.REDIS_DATABASE,
			},
		},
		jwt: {
			accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
			accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
				? Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
				: undefined,
			accessTokenIssuer: process.env.ACCESS_TOKEN_ISSUER,
			refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
				? Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
				: undefined,
			refreshTokenSize: process.env.REFRESH_TOKEN_SIZE
				? Number(process.env.REFRESH_TOKEN_SIZE)
				: undefined,
		},
		oauth2Providers: {
			google: {
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
				scope: ['email', 'profile'],
			},
			facebook: {
				clientID: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
				scope: ['email'],
				profileFields: ['name', 'email', 'displayName', 'id'],
			},
		},
	};

	main(config).catch((error) => {
		console.error('Cannot start the application.', error);
		process.exit(1);
	});
}
