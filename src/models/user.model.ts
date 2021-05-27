import { Entity, hasMany, hasOne, model, property } from '@loopback/repository';

import { UserCredentials } from './user-credentials.model';
import { UserIdentity } from './user-identity.model';

@model()
export class User extends Entity {
	@property({
		id: true,
		generated: true,
		type: 'number',
		required: false,
		jsonSchema: { type: 'integer', minimum: 1 },
		name: 'id',
	})
	id: number;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 100 },
		name: 'name',
	})
	name: string;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 100, format: 'email' },
		index: { unique: true },
		name: 'email',
	})
	email: string;

	@hasOne(() => UserCredentials)
	credentials?: UserCredentials;

	@hasMany(() => UserIdentity)
	identities?: UserIdentity[];

	constructor(data?: Partial<User>) {
		super(data);
	}
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
