import {
	DataObject,
	DefaultKeyValueRepository,
	KeyValueFilter,
	Model,
	Options,
	juggler,
} from '@loopback/repository';

export class CrudKvRepository<
	T extends Model,
> extends DefaultKeyValueRepository<T> {
	constructor(
		entityClass: typeof Model & { prototype: T },
		public readonly dataSource: juggler.DataSource,
		private readonly prefix = '',
		private readonly postfix = '',
	) {
		super(entityClass, dataSource);
	}

	async delete(key: string, options?: Options): Promise<void> {
		return super.delete(this.prefix + key + this.postfix, options);
	}

	async get(key: string, options?: Options): Promise<T> {
		return super.get(this.prefix + key + this.postfix, options);
	}

	async set(
		key: string,
		value: DataObject<T>,
		options?: Options,
	): Promise<void> {
		return super.set(this.prefix + key + this.postfix, value, options);
	}

	async expire(key: string, ttl: number, options?: Options): Promise<void> {
		return super.expire(this.prefix + key + this.postfix, ttl, options);
	}

	async ttl(key: string, options?: Options): Promise<number> {
		return super.ttl(this.prefix + key + this.postfix, options);
	}

	keys(filter?: KeyValueFilter, options?: Options): AsyncIterable<string> {
		if (filter) {
			filter.match = this.prefix + filter.match + this.postfix;
		}

		return super.keys(filter, options);
	}
}
