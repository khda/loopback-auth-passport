import { Entity, belongsTo, model, property } from '@loopback/repository';

import { User, UserWithRelations } from './user.model';

@model()
export class UserCredentials extends Entity {
	@property({
		id: true,
		generated: true,
		type: 'number',
		required: false,
		jsonSchema: { type: 'integer', minimum: 1 },
		name: 'id',
	})
	id: number;

	@belongsTo(() => User)
	userId: number;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 100, format: 'email' },
		name: 'username',
	})
	username: string;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 50 },
		hidden: true,
		name: 'password',
	})
	password: string;

	constructor(data?: Partial<UserCredentials>) {
		super(data);
	}
}

export interface UserCredentialsRelations {
	user?: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials &
	UserCredentialsRelations;
