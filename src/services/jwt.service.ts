import * as crypto from 'crypto';

import { BindingScope, bind, inject, service } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import * as jwt from 'jsonwebtoken';

import { SECOND } from '../constants';
import { ApplicationBindings } from '../keys';
import { AuthUser, Jwt, User } from '../models';
import { RefreshTokenRepository } from '../repositories';

import { UserService } from './user.service';

type TUserId = typeof User.prototype.id;

const INVALID_CREDENTIALS = 'Invalid Credentials!';
const REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found (has expired)!';

// 1 day
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = 86400;
const DEFAULT_ACCESS_TOKEN_SECRET = 'secret';
const DEFAULT_ACCESS_TOKEN_ISSUER = 'loopback4';
// 30 days
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = 604800;
// 32 characters
const DEFAULT_REFRESH_TOKEN_SIZE = 16;

/**
 *
 */
export interface IJwtServiceOptions {
	accessTokenExpiresIn?: number;
	accessTokenSecret?: string;
	accessTokenIssuer?: string;
	refreshTokenExpiresIn?: number;
	refreshTokenSize?: number;
}

/**
 *
 */
@bind({ scope: BindingScope.SINGLETON })
export class JwtService {
	private readonly config: Required<IJwtServiceOptions>;

	/**
	 *
	 */
	constructor(
		@repository(RefreshTokenRepository)
		private readonly refreshTokenRepository: RefreshTokenRepository,
		@service(UserService)
		private readonly userService: UserService,

		@inject(ApplicationBindings.JWT_SERVICE_OPTIONS)
		private readonly options?: IJwtServiceOptions,
	) {
		this.config = {
			accessTokenExpiresIn: DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
			accessTokenSecret: DEFAULT_ACCESS_TOKEN_SECRET,
			accessTokenIssuer: DEFAULT_ACCESS_TOKEN_ISSUER,
			refreshTokenExpiresIn: DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
			refreshTokenSize: DEFAULT_REFRESH_TOKEN_SIZE,
			...this.options,
		};
	}

	/**
	 *
	 */
	async generate(userId: TUserId): Promise<Jwt> {
		try {
			const authUser = await this.userService.formAuthUser(userId);

			const accessToken = jwt.sign(
				authUser.toJSON(),
				this.config.accessTokenSecret,
				{
					expiresIn: this.config.accessTokenExpiresIn,
					issuer: this.config.accessTokenIssuer,
				},
			);

			const refreshToken = crypto
				.randomBytes(this.config.refreshTokenSize)
				.toString('hex');

			await this.refreshTokenRepository.set(refreshToken, authUser, {
				ttl: this.config.refreshTokenExpiresIn * SECOND,
			});

			return new Jwt({ accessToken, refreshToken });
		} catch (error) {
			throw error instanceof HttpErrors.HttpError
				? error
				: new HttpErrors.Unauthorized(INVALID_CREDENTIALS);
		}
	}

	/**
	 *
	 */
	async refreshToken(refreshToken: string): Promise<Jwt> {
		const oldAuthUser = await this.refreshTokenRepository.get(refreshToken);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!oldAuthUser) {
			throw new HttpErrors.Unauthorized(REFRESH_TOKEN_NOT_FOUND);
		}

		return this.generate(oldAuthUser.id);
	}
}
