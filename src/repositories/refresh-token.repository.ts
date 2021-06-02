import { inject } from '@loopback/core';

import { KvRedisDataSource } from '../datasources';
import { DataSourcesBindings } from '../keys';
import { AuthUser } from '../models';

import { CrudKvRepository } from './crud-kv.repository';

const PREFIX = 'refreshToken:';
const POSTFIX = '';

/**
 * "refreshToken": AuthUser
 */
export class RefreshTokenRepository extends CrudKvRepository<AuthUser> {
	constructor(
		@inject(DataSourcesBindings.KV_REDIS)
		dataSource: KvRedisDataSource,
	) {
		super(AuthUser, dataSource, PREFIX, POSTFIX);
	}
}
