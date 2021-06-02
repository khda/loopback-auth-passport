import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';

import { FileDataSource } from '../datasources';
import { UserCredentials } from '../models';

export class UserCredentialsRepository extends DefaultCrudRepository<
	UserCredentials,
	typeof UserCredentials.prototype.id,
	UserCredentials
> {
	constructor(
		@inject('datasources.file')
		public readonly dataSource: FileDataSource,
	) {
		super(UserCredentials, dataSource);
	}
}
