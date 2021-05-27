import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
	name: 'file',
	connector: 'memory',
	localStorage: '',
	file: './data/db.json',
};

export class FileDataSource extends juggler.DataSource {
	static dataSourceName = 'file';
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.file', { optional: true })
		dsConfig: object = config,
	) {
		super(dsConfig);
	}
}
