import { inject } from '@loopback/core';
import { Request, RestBindings, api, get, response } from '@loopback/rest';

const HTTP_STATUS_CODE_OK = 200;

@api({ basePath: '/ping' })
export class PingController {
	constructor(
		@inject(RestBindings.Http.REQUEST)
		private readonly request: Request,
	) {}

	/**
	 *
	 */
	@get('')
	@response(HTTP_STATUS_CODE_OK, {
		description: 'Ping Response',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					title: 'PingResponse',
					properties: {
						greeting: { type: 'string' },
						date: { type: 'string' },
						url: { type: 'string' },
						headers: {
							type: 'object',
							properties: { 'Content-Type': { type: 'string' } },
							additionalProperties: true,
						},
					},
				},
			},
		},
	})
	async ping(): Promise<object> {
		return Promise.resolve({
			greeting: 'Hello from LoopBack',
			date: new Date(),
			url: this.request.url,
			headers: { ...this.request.headers },
		});
	}
}
