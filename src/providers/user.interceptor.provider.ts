import { Interceptor, InvocationContext, Next, Provider } from '@loopback/core';
import { RequestContext, RestBindings } from '@loopback/rest';
import { SecurityBindings } from '@loopback/security';

import { User } from '../models';
import { formUserProfile } from '../services/authentication-strategies/helper';

export class UserInterceptor implements Provider<Interceptor> {
	constructor() {}

	value() {
		return async (invocationCtx: InvocationContext, next: Next) => {
			const requestContext = await invocationCtx.get<RequestContext>(
				RestBindings.Http.CONTEXT,
			);

			requestContext.request.user &&
				requestContext
					.bind(SecurityBindings.USER)
					.to(formUserProfile(requestContext.request.user as User));

			return next();
		};
	}
}
