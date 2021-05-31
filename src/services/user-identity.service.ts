import { UserIdentityService as IUIService } from '@loopback/authentication';
import { BindingScope, bind, service } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Profile as PassportProfile } from 'passport';

import { User, UserIdentity, UserIdentityRelations } from '../models';
import { UserIdentityRepository } from '../repositories/user-identity.repository';

import { CrudRepositoryService } from './crud-repository.service';
import { UserService } from './user.service';

type Id = typeof UserIdentity.prototype.id;

/**
 *
 */
@bind({ scope: BindingScope.SINGLETON, tags: ['service'] })
export class UserIdentityService
	extends CrudRepositoryService<UserIdentity, Id, UserIdentityRelations>
	implements IUIService<PassportProfile, User>
{
	constructor(
		@repository(UserIdentityRepository)
		public userIdentityRepository: UserIdentityRepository,
		@service(UserService)
		private readonly userService: UserService,
	) {
		super(userIdentityRepository);
	}

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

		let user = await this.userService.findOne({ where: { email } });

		if (!user) {
			user = await this.userService.createOne({
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

		return this.userService.findById(userId, {
			include: ['identities', 'credentials'],
		});
	}
}
