import { Entity, belongsTo, model, property } from '@loopback/repository';

import { User, UserWithRelations } from './user.model';

@model()
export class UserIdentity extends Entity {
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
		id: true,
		type: 'string',
		required: true,
		name: 'external_id',
	})
	externalId: string;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 50 },
		name: 'provider',
	})
	provider: string;

	@property({
		type: 'object',
		required: true,
		name: 'profile',
	})
	profile: object;

	@property({
		type: 'string',
		required: true,
		default: () => new Date().toISOString(),
		jsonSchema: { format: 'date-time' },
		name: 'created_at',
	})
	createdAt: string;

	@property({
		type: 'string',
		required: true,
		default: () => new Date().toISOString(),
		jsonSchema: { format: 'date-time' },
		name: 'updated_at',
	})
	updatedAt: string;

	constructor(data?: Partial<UserIdentity>) {
		super(data);
	}
}

export interface UserIdentityRelations {
	user?: UserWithRelations;
}

export type UserIdentityWithRelations = UserIdentity & UserIdentityRelations;
