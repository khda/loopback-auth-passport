import {
	AUTHENTICATION_STRATEGY_NOT_FOUND,
	AuthenticateFn,
	AuthenticationBindings,
	USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
	FindRoute,
	InvokeMethod,
	InvokeMiddleware,
	ParseParams,
	Reject,
	RequestContext,
	RestBindings,
	Send,
	SequenceHandler,
} from '@loopback/rest';
import { v4 as uuidV4 } from 'uuid';

export class MySequence implements SequenceHandler {
	constructor(
		@inject(RestBindings.SequenceActions.FIND_ROUTE)
		private readonly findRoute: FindRoute,
		@inject(RestBindings.SequenceActions.PARSE_PARAMS)
		private readonly parseParams: ParseParams,
		@inject(RestBindings.SequenceActions.INVOKE_METHOD)
		private readonly invoke: InvokeMethod,
		@inject(RestBindings.SequenceActions.SEND)
		private readonly send: Send,
		@inject(RestBindings.SequenceActions.REJECT)
		private readonly reject: Reject,
		@inject(AuthenticationBindings.AUTH_ACTION)
		private readonly authenticateRequest: AuthenticateFn,
		/**
		 * Optional invoker for registered middleware in a chain.
		 * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
		 */
		@inject(RestBindings.SequenceActions.INVOKE_MIDDLEWARE, {
			optional: true,
		})
		private readonly invokeMiddleware: InvokeMiddleware = () => false,
	) {}

	async handle(context: RequestContext) {
		const startTimestamp = Date.now();
		const ruid = uuidV4();

		try {
			const { request, response } = context;
			const isExplorer = request.url.includes('explorer');

			const finished = await this.invokeMiddleware(context);
			if (finished) {
				return;
			}

			const route = this.findRoute(request);
			const args = await this.parseParams(request, route);

			await this.authenticateRequest(request);

			const result = await this.invoke(route, args);
			const endTimestamp = Date.now();
			const meta = {
				ruid,
				startDateTime: new Date(startTimestamp).toISOString(),
				endDateTime: new Date(endTimestamp).toISOString(),
				executionTime: endTimestamp - startTimestamp,
			};

			this.send(response, isExplorer ? result : { meta, result });
		} catch (error) {
			if (
				error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
				error.code === USER_PROFILE_NOT_FOUND
			) {
				error.statusCode = 401;
			}

			const endTimestamp = Date.now();

			error.meta = {
				ruid,
				startDateTime: new Date(startTimestamp).toISOString(),
				endDateTime: new Date(endTimestamp).toISOString(),
				executionTime: endTimestamp - startTimestamp,
			};

			this.reject(context, error);
		}
	}
}
