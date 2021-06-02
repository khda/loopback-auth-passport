import {
	AuthenticationBindings,
	UserProfileFactory,
} from '@loopback/authentication';
import {
	Interceptor,
	InvocationContext,
	Next,
	Provider,
	inject,
} from '@loopback/core';
import { RequestContext, RestBindings } from '@loopback/rest';
import { SecurityBindings } from '@loopback/security';

import { AuthUser } from '../models';

export class UserInterceptor implements Provider<Interceptor> {
	constructor(
		@inject(AuthenticationBindings.USER_PROFILE_FACTORY)
		private readonly userProfileFactory: UserProfileFactory<AuthUser>,
	) {}

	value() {
		return async (invocationCtx: InvocationContext, next: Next) => {
			const requestContext = await invocationCtx.get<RequestContext>(
				RestBindings.Http.CONTEXT,
			);

			requestContext.request.user &&
				requestContext
					.bind(SecurityBindings.USER)
					.to(
						this.userProfileFactory(
							requestContext.request.user as AuthUser,
						),
					);

			return next();
		};
	}
}
