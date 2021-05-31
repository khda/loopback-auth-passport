import { BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { UserCredentials, UserCredentialsRelations } from '../models';
import { UserCredentialsRepository } from '../repositories';

import { CrudRepositoryService } from './crud-repository.service';

type Id = typeof UserCredentials.prototype.id;

@bind({ scope: BindingScope.SINGLETON, tags: ['service'] })
export class UserCredentialsService extends CrudRepositoryService<
	UserCredentials,
	Id,
	UserCredentialsRelations
> {
	constructor(
		@repository(UserCredentialsRepository)
		private readonly userCredentialsRepository: UserCredentialsRepository,
	) {
		super(userCredentialsRepository);
	}
}
