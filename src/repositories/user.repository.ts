import { Getter, inject } from '@loopback/core';
import {
	DefaultCrudRepository,
	HasManyRepositoryFactory,
	HasOneRepositoryFactory,
	repository,
} from '@loopback/repository';

import { FileDataSource } from '../datasources';
import { User, UserCredentials, UserIdentity } from '../models';

import { UserCredentialsRepository } from './user-credentials.repository';
import { UserIdentityRepository } from './user-identity.repository';

export class UserRepository extends DefaultCrudRepository<
	User,
	typeof User.prototype.id
> {
	public readonly identities: HasManyRepositoryFactory<
		UserIdentity,
		typeof User.prototype.id
	>;

	public readonly credentials: HasOneRepositoryFactory<
		UserCredentials,
		typeof User.prototype.id
	>;

	constructor(
		@inject('datasources.file')
		public readonly dataSource: FileDataSource,
		@repository.getter('UserIdentityRepository')
		private readonly userIdentityRepositoryGetter: Getter<UserIdentityRepository>,
		@repository.getter('UserCredentialsRepository')
		private readonly userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
	) {
		super(User, dataSource);

		this.identities = this.createHasManyRepositoryFactoryFor(
			'identities',
			userIdentityRepositoryGetter,
		);
		this.registerInclusionResolver(
			'identities',
			this.identities.inclusionResolver,
		);

		this.credentials = this.createHasOneRepositoryFactoryFor(
			'credentials',
			userCredentialsRepositoryGetter,
		);
		this.registerInclusionResolver(
			'credentials',
			this.credentials.inclusionResolver,
		);
	}
}
