import { range } from './helpers/array.helper';

export class CellCollection {
	availableValues: RangeSet<1, number>;

	constructor(valueCount: number) {
		this.availableValues = new RangeSet(1, valueCount + 1);
	}

	popValue(value: number): void {
		this.availableValues.unset(value);
	}

	pushValue(value: number): void {
		this.availableValues.reset(value);
	}

	intersect(...args: CellCollection[]): number[] {
		let result = this.availableValues;
		for (let i = 0; i < args.length; i++) {
			result = result.intersect(args[i]!.availableValues);
		}
		return result.toArray();
	}
}

class RangeSet<Minimum extends number, Maximum extends number> {
	private _minimum: number;
	private _maximum: number;
	private _set: Array<number | null>;

	constructor(reference: RangeSet<Minimum, Maximum>);	
	constructor(minimum: Minimum, maximum: Maximum);
	constructor(
		minimum: Minimum | RangeSet<Minimum, Maximum>,
		maximum?: Maximum
	) {
		if (minimum instanceof RangeSet) {
			this._set = minimum._set.slice(0);
			this._minimum = minimum._minimum;
			this._maximum = minimum._maximum;
		} else {
			this._set = range(minimum, maximum) as unknown[] as Array<number | null>;
			this._minimum = minimum;
			this._maximum = maximum!;
		}
	}

	unset(value: number): void {
		this._set[value - this._minimum] = null;
	}

	reset(value: number): void {
		this._set[value - this._minimum] = value;
	}

	intersect(other: RangeSet<Minimum, Maximum>): RangeSet<Minimum, Maximum> {
		const result = new RangeSet(this);

		for (let i = 0; i < result._set.length; i++) {
			result._set[i] = result._set[i] === other._set[i]
				? result._set[i] as number
				: null;
		}

		return result;
	}

	toArray(): number[] {
		const _result = new Array<number>();
		for (let i = 0; i < this._set.length; i++) {
			if (this._set[i] !== null) {
				_result.push(this._set[i] as number);
			}
		}
		return _result;
	}
}
