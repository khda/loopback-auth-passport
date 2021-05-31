import { BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { User, UserRelations } from '../models';
import { UserRepository } from '../repositories';

import { CrudRepositoryService } from './crud-repository.service';

type Id = typeof User.prototype.id;

@bind({ scope: BindingScope.SINGLETON, tags: ['service'] })
export class UserService extends CrudRepositoryService<
	User,
	Id,
	UserRelations
> {
	constructor(
		@repository(UserRepository)
		private readonly userRepository: UserRepository,
	) {
		super(userRepository);
	}
}
