import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { inject, intercept, service } from '@loopback/core';
import {
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
	FACEBOOK_AUTHENTICATION_STRATEGY_NAME,
	GOOGLE_AUTHENTICATION_STRATEGY_NAME,
	LOCAL_AUTHENTICATION_STRATEGY_NAME,
	UserCredentialsService,
	UserService,
} from '../services';

@api({ basePath: '/auth' })
export class AuthController {
	constructor(
		@service(UserService)
		private readonly userService: UserService,
		@service(UserCredentialsService)
		private readonly userCredentialsService: UserCredentialsService,
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
			await this.userCredentialsService.findOne({
				where: { username: signupRequest.username },
			});

		if (existingUserCredentials) {
			return this.userService.findById(existingUserCredentials.userId, {
				include: ['identities', 'credentials'],
			});
		}

		const user = await this.userService.createOne({
			name: signupRequest.username,
			email: signupRequest.username,
		});

		const userCredentials = await this.userCredentialsService.createOne({
			userId: user.id,
			username: signupRequest.username,
			password: signupRequest.password,
		});

		return this.userService.findById(user.id, {
			include: ['identities', 'credentials'],
		});
	}

	/**
	 *
	 */
	@authenticate(LOCAL_AUTHENTICATION_STRATEGY_NAME)
	@post('/login', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(User) },
				},
			},
		},
	})
	login(
		@requestBody({
			content: {
				'application/json': { schema: getModelSchemaRef(LoginRequest) },
			},
		})
		loginRequest: LoginRequest,
		@inject(SecurityBindings.USER) user: User,
	): User {
		return user;
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
