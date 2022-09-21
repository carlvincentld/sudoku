// Function returning a pseudorandom number between 0 and 1
export type RandomFunc = () => number;

function rotateLeft32Bits(x: number, k: number) {
	return (x << k) | (x >>> (32 - k));
}

// @see: https://stackoverflow.com/a/47593316
export function cyrb128(str: string): [number, number, number, number] {
	let h1 = 1779033703;
	let h2 = 3144134277;
	let h3 = 1013904242;
	let h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [
		(h1 ^ h2 ^ h3 ^ h4) >>> 0,
		(h2 ^ h1) >>> 0,
		(h3 ^ h1) >>> 0,
		(h4 ^ h1) >>> 0,
	];
}

// @see: https://stackoverflow.com/a/47593316
export function xoshiro128ss(
	a: number,
	b: number,
	c: number,
	d: number
): RandomFunc {
	return () => {
		const result = rotateLeft32Bits(a * 5, 7) * 9;
		const t = b << 17;
		c ^= a;
		d ^= b;
		b ^= c;
		a ^= d;

		c ^= t;

		d = rotateLeft32Bits(d, 11);

		return (result >>> 0) / 4_294_967_296;
	};
}

export function shuffle<T>(
	array: Iterable<T>,
	random: RandomFunc = Math.random
): T[] {
	const result = Array.from(array);
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j]!, result[i]!];
	}
	return result;
}
