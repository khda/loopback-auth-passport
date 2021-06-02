import { Model, model, property } from '@loopback/repository';

@model()
export class AuthUser extends Model {
	@property({ type: 'number', required: true })
	id: number;

	constructor(data?: Partial<AuthUser>) {
		super(data);
	}
}
