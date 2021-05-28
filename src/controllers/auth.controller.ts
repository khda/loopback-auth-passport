import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { inject, intercept } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
	HttpErrors,
	Response,
	RestBindings,
	api,
	get,
	getModelSchemaRef,
	post,
	requestBody,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';

import { PassportBindings } from '../keys';
import { LoginRequest, User } from '../models';
import {
	UserCredentialsRepository,
	UserIdentityRepository,
	UserRepository,
} from '../repositories';
import {
	FACEBOOK_AUTHENTICATION_STRATEGY_NAME,
	GOOGLE_AUTHENTICATION_STRATEGY_NAME,
} from '../services';

@api({ basePath: '/auth' })
export class AuthController {
	constructor(
		@repository(UserRepository)
		private readonly userRepository: UserRepository,
		@repository(UserCredentialsRepository)
		private readonly userCredentialsRepository: UserCredentialsRepository,
		@repository(UserIdentityRepository)
		private readonly userIdentityRepository: UserIdentityRepository,
	) {}

	/**
	 *
	 */
	@post('/signup', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(User) },
				},
			},
		},
	})
	async signup(
		@requestBody({
			content: {
				'application/json': { schema: getModelSchemaRef(LoginRequest) },
			},
		})
		signupRequest: LoginRequest,
	): Promise<User> {
		const existingUserCredentials =
			await this.userCredentialsRepository.findOne({
				where: { username: signupRequest.username },
			});

		if (existingUserCredentials) {
			return this.userRepository.findById(
				existingUserCredentials.userId,
				{ include: ['identities', 'credentials'] },
			);
		}

		const user = await this.userRepository.create({
			name: signupRequest.username,
			email: signupRequest.username,
		});

		const userCredentials = await this.userCredentialsRepository.create({
			userId: user.id,
			username: signupRequest.username,
			password: signupRequest.password,
		});

		return this.userRepository.findById(user.id, {
			include: ['identities', 'credentials'],
		});
	}

	/**
	 *
	 */
	@post('/login', {
		responses: {
			'200': {
				content: {
					'application/json': {
						schema: getModelSchemaRef(LoginRequest),
					},
				},
			},
		},
	})
	async login(
		@requestBody({
			content: {
				'application/json': { schema: getModelSchemaRef(LoginRequest) },
			},
		})
		loginRequest: LoginRequest,
	): Promise<User> {
		const { username, password } = loginRequest;

		const userCredentials = await this.userCredentialsRepository.findOne({
			where: { username },
		});

		if (!userCredentials || !userCredentials.password) {
			throw new HttpErrors.Unauthorized('User not found!');
		} else if (!(password === userCredentials.password)) {
			throw new HttpErrors.Unauthorized('Invalid Credentials!');
		}

		return this.userRepository.findById(userCredentials.userId, {
			include: ['identities', 'credentials'],
		});
	}

	@authenticate(GOOGLE_AUTHENTICATION_STRATEGY_NAME)
	@get('/google', {
		responses: {
			200: {
				description: 'A successful response.',
				content: { 'application/json': { schema: { type: 'string' } } },
			},
		},
	})
	loginViaGoogle(
		@inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_URL)
		redirectUrl: string,
		// 303 (need 302 by default)
		@inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_STATUS)
		status: number,
		@inject(RestBindings.Http.RESPONSE)
		response: Response,
	) {
		// response.statusCode = status || 302;
		// response.setHeader('Location', redirectUrl);
		// response.end();

		// return response;

		return redirectUrl;
	}

	@intercept(PassportBindings.GOOGLE_CALLBACK_INTERCEPTOR)
	@get('/google/callback')
	googleCallback(@inject(SecurityBindings.USER) user: UserProfile) {
		console.log('user', user);

		return user;
	}

	@authenticate(FACEBOOK_AUTHENTICATION_STRATEGY_NAME)
	@get('/facebook', {
		responses: {
			200: {
				description: 'A successful response.',
				content: { 'application/json': { schema: { type: 'string' } } },
			},
		},
	})
	loginViaFacebook(
		@inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_URL)
		redirectUrl: string,
		// 303 (need 302 by default)
		@inject(AuthenticationBindings.AUTHENTICATION_REDIRECT_STATUS)
		status: number,
		@inject(RestBindings.Http.RESPONSE)
		response: Response,
	) {
		// response.statusCode = status || 302;
		// response.setHeader('Location', redirectUrl);
		// response.end();

		// return response;

		return redirectUrl;
	}

	@intercept(PassportBindings.FACEBOOK_CALLBACK_INTERCEPTOR)
	@get('/facebook/callback')
	facebookCallback(@inject(SecurityBindings.USER) user: UserProfile) {
		console.log('user', user);

		return user;
	}
}
