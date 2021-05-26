import { BindingKey } from '@loopback/core';

export namespace ApplicationBindings {
	export const PROJECT_NAME = BindingKey.create<string>(
		'application.projectName',
	);
}
