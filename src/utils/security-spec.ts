import { ReferenceObject, SecuritySchemeObject } from '@loopback/openapi-v3';

export const BEARER_SECURITY = [{ bearer: [] }];

export const SECURITY_SCHEMES: Record<
	string,
	SecuritySchemeObject | ReferenceObject
> = {
	bearer: {
		name: 'jwt',
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
	},
};
