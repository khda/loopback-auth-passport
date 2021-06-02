import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';

import { FileDataSource } from '../datasources';
import { UserIdentity } from '../models';

export class UserIdentityRepository extends DefaultCrudRepository<
	UserIdentity,
	typeof UserIdentity.prototype.id,
	UserIdentity
> {
	constructor(
		@inject('datasources.file')
		public readonly dataSource: FileDataSource,
	) {
		super(UserIdentity, dataSource);
	}
}
