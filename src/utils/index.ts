export * from './security-spec';

export type TTransform<
	T,
	O extends keyof T = never,
	P extends keyof T = never,
> = Omit<T, O | P> & Partial<Pick<T, P>>;

/**
 *
 */
export const unique = <T>(value: T, index: number, array: T[]) =>
	array.indexOf(value) === index;

/**
 *
 */
export const field =
	<T, K extends keyof T>(name: K) =>
	(value: T) =>
		value[name];

/**
 *
 */
export const notEmpty = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined;

/**
 *
 */
export const getFieldMap = <E, K1 extends keyof E, K2 extends keyof E>(
	items: E[],
	key1: K1,
	key2: K2,
): Map<E[K1], E[K2]> =>
	new Map(items.map((value) => [value[key1], value[key2]]));

/**
 *
 */
export const getFieldsMap = <E, K1 extends keyof E, K2 extends keyof E>(
	items: E[],
	key1: K1,
	key2: K2,
): Map<E[K1], E[K2][]> =>
	items.reduce(
		(accumulator, value) =>
			accumulator.set(
				value[key1],
				(accumulator.get(value[key1]) ?? []).concat(value[key2]),
			),
		new Map<E[K1], E[K2][]>(),
	);

/**
 *
 */
export const getEntryMap = <E, K extends keyof E>(
	items: E[],
	key: K,
): Map<E[K], E> => new Map(items.map((value) => [value[key], value]));

/**
 *
 */
export const getEntriesMap = <E, K extends keyof E>(
	items: E[],
	key: K,
): Map<E[K], E[]> =>
	items.reduce(
		(accumulator, value) =>
			accumulator.set(
				value[key],
				(accumulator.get(value[key]) ?? []).concat(value),
			),
		new Map<E[K], E[]>(),
	);

/**
 *
 */
export const getIntersection = <T>(array1: T[] = [], array2: T[] = []) => ({
	leftDifference: array1.filter((value) => !array2.includes(value)),
	intersection: array1.filter((value) => array2.includes(value)),
	rightDifference: array2.filter((value) => !array1.includes(value)),
});
