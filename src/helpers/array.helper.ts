export function range(start: number, end?: number): number[] {
	if (end === null || end === undefined) {
		end = start;
		start = 0;
	}

	return new Array(end - start)
		.fill(0)
		.map((_, i) => i + start);
}

export function unique<T>(array: Array<T>): Array<T> {
	return Array.from(new Set(array));
}

export function zip<A, B>(a: Array<A>, b: Array<B>): Array<[A, B]> {
	const result = new Array<[A, B]>();
	const maxLength = Math.max(a.length, b.length);
	for (let i = 0; i < maxLength; i++) {
		result.push([a[i]!, b[i]!]);
	}
	return result;
}

export function shuffle<T>(array: Iterable<T>): T[] {
	const result = Array.from(array);
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j]!, result[i]!];
	}
	return result;
}

export function groupBy<T, K>(iterable: Iterable<T>, keyFunc: (value: T, index: number) => K): Map<K, T[]> {
	const array = Array.from(iterable);
	return array.reduce(
		(acc, current, index) => {
			const key = keyFunc(current, index);
			if (acc.has(key)) {
				acc.get(key)!.push(current);
			} else {
				acc.set(key, [current]);
			}
			return acc;
		},
		new Map<K, T[]>()
	);
}

export function groupBySet<T, K>(iterable: Iterable<T>, keyFunc: (value: T, index: number) => K): Map<K, Set<T>> {
	const array = Array.from(iterable);
	return array.reduce(
		(acc, current, index) => {
			const key = keyFunc(current, index);
			if (acc.has(key)) {
				acc.get(key)!.add(current);
			} else {
				acc.set(key, new Set([current]));
			}
			return acc;
		},
		new Map<K, Set<T>>()
	);
}