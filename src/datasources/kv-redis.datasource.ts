import {
	BindingScope,
	ContextTags,
	LifeCycleObserver,
	ValueOrPromise,
	bind,
	config,
	lifeCycleObserver,
} from '@loopback/core';
import { juggler } from '@loopback/repository';

import { DataSourcesBindings } from '../keys';
import { IKvRedisDataSourceConfig } from '../types';

@bind({
	scope: BindingScope.SINGLETON,
	tags: { [ContextTags.KEY]: DataSourcesBindings.KV_REDIS },
})
@lifeCycleObserver('datasource')
export class KvRedisDataSource
	extends juggler.DataSource
	implements LifeCycleObserver {
	static dataSourceName = 'KvRedis';

	constructor(
		@config()
		dsConfig: IKvRedisDataSourceConfig = { connector: 'kv-redis' },
	) {
		super(dsConfig);
	}

	/**
	 * Start the datasource when application is started
	 */
	start(): ValueOrPromise<void> {
		// Add your logic here to be invoked when the application is started
	}

	/**
	 * Disconnect the datasource when application is stopped. This allows the
	 * application to be shut down gracefully.
	 */
	stop(): ValueOrPromise<void> {
		return super.disconnect();
	}
}
