import { BindingScope, bind } from '@loopback/core';
import {
	AnyObject,
	Command,
	Count,
	DataObject,
	DefaultCrudRepository,
	Entity,
	Filter,
	FilterExcludingWhere,
	NamedParameters,
	PositionalParameters,
	Where,
} from '@loopback/repository';

@bind({ scope: BindingScope.SINGLETON, tags: ['service'] })
export class CrudRepositoryService<
	E extends Entity,
	Id,
	Relations extends object = object,
> {
	constructor(
		private readonly repository: DefaultCrudRepository<E, Id, Relations>,
	) {}

	/**
	 *
	 */
	async createOne(entityRaw: DataObject<E>): Promise<E & Relations> {
		const entity = await this.repository.create(entityRaw);

		return this.findById(entity.getId() as Id);
	}

	/**
	 *
	 */
	async createAll(entitiesRaw: DataObject<E>[]): Promise<(E & Relations)[]> {
		const entities = await this.repository.createAll(entitiesRaw);

		return Promise.all(
			entities.map(async (entity) => this.findById(entity.getId() as Id)),
		);
	}

	/**
	 *
	 */
	async findOne(filter?: Filter<E>): Promise<(E & Relations) | null> {
		return this.repository.findOne(filter);
	}

	/**
	 *
	 */
	async findById(
		id: Id,
		filter?: FilterExcludingWhere<E>,
	): Promise<E & Relations> {
		return this.repository.findById(id, filter);
	}

	/**
	 *
	 */
	async findAll(filter?: Filter<E>): Promise<(E & Relations)[]> {
		return this.repository.find(filter);
	}

	/**
	 *
	 */
	async count(where?: Where<E>): Promise<Count> {
		return this.repository.count(where);
	}

	/**
	 *
	 */
	async updateById(id: Id, entityRaw: DataObject<E>): Promise<E & Relations> {
		await this.repository.updateById(id, entityRaw);

		return this.findById(id);
	}

	/**
	 *
	 */
	async updateAll(
		entityRaw: DataObject<E>,
		where?: Where<E>,
	): Promise<(E & Relations)[]> {
		await this.repository.updateAll(entityRaw, where);

		return this.findAll({ where });
	}

	/**
	 *
	 */
	async replaceById(
		id: Id,
		entityRaw: DataObject<E>,
	): Promise<E & Relations> {
		await this.repository.replaceById(id, entityRaw);

		return this.findById(id);
	}

	/**
	 *
	 */
	async deleteOne(filter?: Filter<E>): Promise<(E & Relations) | null> {
		const entity = await this.findOne(filter);

		return entity && this.deleteById(entity.getId() as Id);
	}

	/**
	 *
	 */
	async deleteById(id: Id): Promise<E & Relations> {
		const entity = await this.findById(id);

		await this.repository.deleteById(id);

		return entity;
	}

	/**
	 *
	 */
	async deleteAll(where?: Where<E>): Promise<(E & Relations)[]> {
		const entities = await this.findAll({ where });

		await this.repository.deleteAll(where);

		return entities;
	}

	/**
	 *
	 */
	async exists(id: Id): Promise<boolean> {
		return this.repository.exists(id);
	}

	/**
	 *
	 */
	async execute(
		command: Command,
		parameters: NamedParameters | PositionalParameters,
	): Promise<AnyObject> {
		return this.repository.execute(command, parameters);
	}

	/**
	 *
	 */
	async upsertOne(entityRaw: Entity & DataObject<E>): Promise<E & Relations> {
		const id = entityRaw.getId() as Id;

		const isExists = await this.exists(id);

		return isExists
			? this.updateById(id, entityRaw)
			: this.createOne(entityRaw);
	}
}
