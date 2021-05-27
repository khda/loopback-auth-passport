import { UserIdentityService as IUIService } from '@loopback/authentication';
import { BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Profile as PassportProfile } from 'passport';

import { User } from '../models';
import { UserRepository } from '../repositories';
import { UserIdentityRepository } from '../repositories/user-identity.repository';

/**
 *
 */
@bind({ scope: BindingScope.SINGLETON, tags: ['service'] })
export class UserIdentityService implements IUIService<PassportProfile, User> {
	constructor(
		@repository(UserRepository)
		public userRepository: UserRepository,
		@repository(UserIdentityRepository)
		public userIdentityRepository: UserIdentityRepository,
	) {}

	/**
	 *
	 */
	async findOrCreateUser(passportProfile: PassportProfile): Promise<User> {
		if (!passportProfile.emails?.length) {
			throw new Error(
				'Email-id is required in returned profile to login!',
			);
		}

		const email = passportProfile.emails[0].value;

		let user = await this.userRepository.findOne({ where: { email } });

		if (!user) {
			user = await this.userRepository.create({
				name: passportProfile.name?.givenName
					? passportProfile.name.givenName +
					  ' ' +
					  passportProfile.name.familyName
					: passportProfile.displayName,
				email,
			});
		}

		return this.linkExternalProfile(String(user.id), passportProfile);
	}

	/**
	 *
	 */
	async linkExternalProfile(
		userIdString: string,
		passportProfile: PassportProfile,
	): Promise<User> {
		const userId = Number(userIdString);

		const existingUserIdentity = await this.userIdentityRepository.findOne({
			where: {
				provider: passportProfile.provider,
				externalId: passportProfile.id,
			},
		});

		if (existingUserIdentity) {
			await this.userIdentityRepository.updateById(
				existingUserIdentity.id,
				{
					profile: passportProfile,
					updatedAt: new Date().toISOString(),
				},
			);
		} else {
			await this.userIdentityRepository.create({
				userId,
				externalId: passportProfile.id,
				provider: passportProfile.provider,
				profile: passportProfile,
			});
		}

		return this.userRepository.findById(userId, {
			include: ['identities', 'credentials'],
		});
	}
}
