export function intersection<T>(
	xs: Set<T>,
	ys: Set<T>,
	...args: Set<T>[]
): Set<T> {
	const result = new Set<T>();
	for (const x of xs) {
		if (ys.has(x)) {
			result.add(x);
		}
	}

	for (const zs of args) {
		for (const x of result) {
			if (!zs.has(x)) {
				result.delete(x);
			}
		}
	}

	return result;
}
