import { BindingScope, Provider, injectable, service } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { IVerifyOptions, Strategy } from 'passport-local';

import { UserCredentialsService, UserService } from '../services';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TDone = (error: any, user?: any, options?: IVerifyOptions) => void;

@injectable.provider({ scope: BindingScope.SINGLETON })
export class LocalStrategyProvider implements Provider<Strategy> {
	strategy: Strategy;

	constructor(
		@service(UserService)
		private readonly userService: UserService,
		@service(UserCredentialsService)
		private readonly userCredentialsService: UserCredentialsService,
	) {
		this.strategy = new Strategy(
			(username: string, password: string, done: TDone) => {
				this.userCredentialsService
					.findOne({ where: { username } })
					.then(async (userCredentials) => {
						if (!userCredentials || !userCredentials.password) {
							throw new HttpErrors.Unauthorized(
								'User not found!',
							);
						} else if (!(password === userCredentials.password)) {
							throw new HttpErrors.Unauthorized(
								'Invalid Credentials!',
							);
						}

						return this.userService.findById(
							userCredentials.userId,
							{ include: ['identities', 'credentials'] },
						);
					})
					.then((user) => done(null, user))
					.catch((error) => done(error));
			},
		);
	}

	value() {
		return this.strategy;
	}
}
