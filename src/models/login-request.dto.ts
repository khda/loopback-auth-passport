import { Model, model, property } from '@loopback/repository';

@model()
export class LoginRequest extends Model {
	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 100, format: 'email' },
	})
	username: string;

	@property({
		type: 'string',
		required: true,
		jsonSchema: { minLength: 1, maxLength: 50 },
	})
	password: string;

	constructor(data?: Partial<LoginRequest>) {
		super(data);
	}
}
