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
	post,
	requestBody,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';

import { PassportBindings } from '../keys';
import { AuthUser, Jwt, LoginRequest, User } from '../models';
import {
	FACEBOOK_AUTHENTICATION_STRATEGY_NAME,
	GOOGLE_AUTHENTICATION_STRATEGY_NAME,
	JWT_AUTHENTICATION_STRATEGY_NAME,
	JwtService,
	LOCAL_AUTHENTICATION_STRATEGY_NAME,
	UserCredentialsService,
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
		@inject(SecurityBindings.USER) user: User,
	): Promise<Jwt> {
		return this.jwtService.generate(user.id);
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
		user: UserProfile,
	): Promise<Jwt> {
		console.log('user', user);

		return this.jwtService.generate(user.id);
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
		user: UserProfile,
	): Promise<Jwt> {
		console.log('user', user);

		return this.jwtService.generate(user.id);
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
	async profile(
		@inject(SecurityBindings.USER)
		authUser: AuthUser & UserProfile,
	): Promise<User> {
		return this.userService.findById(authUser.id, {
			include: ['identities', 'credentials'],
		});
	}
}
