import { range } from './helpers/array.helper';

export class CellCollection {
	availableValues: Array<number>;
	constructor(valueCount: number) {
		this.availableValues = range(1, valueCount + 1);
	}

	popValue(value: number): void {
		this.availableValues[value - 1] = 0;
	}

	pushValue(value: number): void {
		this.availableValues[value - 1] = value;
	}

	// TODO: Déplacer la logique de gestion de valeurs dans sa propre classe
	intersectValues(...collection: CellCollection[]): Set<number> {
		const result = new Set<number>();
		for (let i = 0; i < this.availableValues.length; i++) {
			if (
				this.availableValues[i] !== 0 
				&& collection.every(xs => xs.availableValues[i] === this.availableValues[i])) {
				result.add(this.availableValues[i]);
			}
		}
		return result;
	}
}
