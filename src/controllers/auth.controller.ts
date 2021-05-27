import { repository } from '@loopback/repository';
import {
	HttpErrors,
	api,
	getModelSchemaRef,
	post,
	requestBody,
} from '@loopback/rest';

import { LoginRequest, User } from '../models';
import {
	UserCredentialsRepository,
	UserIdentityRepository,
	UserRepository,
} from '../repositories';

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
}
