import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { inject, intercept, service } from '@loopback/core';
import {
	HttpErrors,
	Response,
	RestBindings,
	api,
	get,
	getModelSchemaRef,
	param,
	patch,
	post,
	requestBody,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';

import { PassportBindings } from '../keys';
import { AuthUser, Jwt, LoginRequest, User, UserCredentials } from '../models';
import {
	FACEBOOK_AUTHENTICATION_STRATEGY_NAME,
	GOOGLE_AUTHENTICATION_STRATEGY_NAME,
	JWT_AUTHENTICATION_STRATEGY_NAME,
	JwtService,
	LOCAL_AUTHENTICATION_STRATEGY_NAME,
	UserCredentialsService,
	UserIdentityService,
	UserService,
} from '../services';
import { BEARER_SECURITY } from '../utils';

@api({ basePath: '/auth' })
export class AuthController {
	constructor(
		@service(UserService)
		private readonly userService: UserService,
		@service(JwtService)
		private readonly jwtService: JwtService,
		@service(UserCredentialsService)
		private readonly userCredentialsService: UserCredentialsService,
		@service(UserIdentityService)
		private readonly userIdentityService: UserIdentityService,
	) {}

	/**
	 *
	 */
	@post('/signup', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(Jwt) },
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
	): Promise<Jwt> {
		const existingUserCredentials =
			await this.userCredentialsService.findOne({
				where: { username: signupRequest.username },
			});

		if (existingUserCredentials) {
			throw new HttpErrors.BadRequest(
				'User with the same username already exists!',
			);
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

		return this.jwtService.generate(user.id);
	}

	/**
	 *
	 */
	@authenticate(LOCAL_AUTHENTICATION_STRATEGY_NAME)
	@post('/login', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(Jwt) },
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
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
	): Promise<Jwt> {
		return this.jwtService.generate(authUser.id);
	}

	/**
	 *
	 */
	@authenticate(GOOGLE_AUTHENTICATION_STRATEGY_NAME)
	@get('/google', {
		responses: {
			'200': {
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

	/**
	 *
	 */
	@intercept(PassportBindings.GOOGLE_CALLBACK_INTERCEPTOR)
	@get('/google/callback', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(Jwt) },
				},
			},
		},
	})
	async googleCallback(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
	): Promise<Jwt> {
		console.log('authUser', authUser);

		return this.jwtService.generate(authUser.id);
	}

	/**
	 *
	 */
	@authenticate(FACEBOOK_AUTHENTICATION_STRATEGY_NAME)
	@get('/facebook', {
		responses: {
			'200': {
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

	/**
	 *
	 */
	@intercept(PassportBindings.FACEBOOK_CALLBACK_INTERCEPTOR)
	@get('/facebook/callback', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(Jwt) },
				},
			},
		},
	})
	async facebookCallback(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
	): Promise<Jwt> {
		console.log('authUser', authUser);

		return this.jwtService.generate(authUser.id);
	}

	/**
	 *
	 */
	@post('/refresh-token', {
		responses: {
			'200': {
				content: {
					'application/json': { schema: { 'x-ts-type': Jwt } },
				},
			},
		},
	})
	async refreshToken(
		@param.query.string('refreshToken')
		refreshToken: string,
	): Promise<Jwt> {
		return this.jwtService.refreshToken(refreshToken);
	}

	/**
	 *
	 */
	@authenticate(JWT_AUTHENTICATION_STRATEGY_NAME)
	@post('/logout', {
		security: BEARER_SECURITY,
		responses: {
			'200': {
				content: {
					'application/json': { schema: { type: 'boolean' } },
				},
			},
		},
	})
	async logout(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
		@param.header.string('authorization')
		authorization: string,
	): Promise<true> {
		const accessToken = authorization.replace(/bearer /iu, '');

		return Promise.resolve(true);
	}

	/**
	 *
	 */
	@authenticate(JWT_AUTHENTICATION_STRATEGY_NAME)
	@get('/profile', {
		security: BEARER_SECURITY,
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(User) },
				},
			},
		},
	})
	async getProfile(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
	): Promise<User> {
		return this.userService.findById(authUser.id, {
			include: ['identities', 'credentials'],
		});
	}

	/**
	 *
	 */
	@authenticate(JWT_AUTHENTICATION_STRATEGY_NAME)
	@patch('/profile', {
		security: BEARER_SECURITY,
		responses: {
			'200': {
				content: {
					'application/json': { schema: getModelSchemaRef(User) },
				},
			},
		},
	})
	async updateProfile(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(User, {
						title: 'UserToUpdate',
						partial: true,
						exclude: ['id'],
					}),
				},
			},
		})
		userToUpdate: Partial<Omit<User, 'id'>>,
	): Promise<User> {
		if (userToUpdate.email) {
			await this.userIdentityService.deleteAll({ userId: authUser.id });
		}

		return this.userService.updateById(authUser.id, userToUpdate);
	}

	/**
	 *
	 */
	@authenticate(JWT_AUTHENTICATION_STRATEGY_NAME)
	@patch('/credentials', {
		security: BEARER_SECURITY,
		responses: {
			'200': {
				content: {
					'application/json': {
						schema: getModelSchemaRef(UserCredentials),
					},
				},
			},
		},
	})
	async updateCredentials(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
		@requestBody({
			content: {
				'application/json': {
					schema: getModelSchemaRef(UserCredentials, {
						title: 'UserCredentialsToUpdate',
						partial: true,
						exclude: ['id', 'userId'],
					}),
				},
			},
		})
		userCredentialsToUpdate: Partial<
			Omit<UserCredentials, 'id' | 'userId'>
		>,
	): Promise<UserCredentials> {
		return this.userCredentialsService.updateById(
			authUser.id,
			userCredentialsToUpdate,
		);
	}
}
