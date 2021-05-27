import path from 'path';

import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication, RestBindings } from '@loopback/rest';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';

import { PROJECT_NAME_DEFAULT } from './constants';
import { ApplicationBindings } from './keys';
import { MySequence } from './sequence';
import { ILoopbackAuthPassportApplicationConfig } from './types';

export { ApplicationConfig };

export class LoopbackAuthPassportApplication extends BootMixin(
	ServiceMixin(RepositoryMixin(RestApplication)),
) {
	constructor(options: ILoopbackAuthPassportApplicationConfig = {}) {
		super(options);

		// Set up the custom sequence
		this.sequence(MySequence);

		// Set up default home page
		this.static('/', path.join(__dirname, '../public'));

		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
		});
		this.component(RestExplorerComponent);

		this.projectRoot = __dirname;
		// Customize @loopback/boot Booter Conventions here
		this.bootOptions = {
			controllers: {
				// Customize ControllerBooter Conventions here
				dirs: ['controllers'],
				extensions: ['.controller.js'],
				nested: true,
			},
			repositories: {
				dirs: ['repositories'],
				extensions: ['.repository.js'],
				nested: true,
			},
		};

		this.api({
			openapi: '3.0.0',
			info: { title: 'Loopback Auth Passport', version: '0.0.1' },
			paths: {},
			servers: [{ url: '/' }],
		});

		this.bind(ApplicationBindings.PROJECT_NAME).to(
			options.application?.projectName ?? PROJECT_NAME_DEFAULT,
		);
		this.bind(RestBindings.ERROR_WRITER_OPTIONS).to(
			options.rest?.errorWriterOptions ?? {},
		);
	}
}
