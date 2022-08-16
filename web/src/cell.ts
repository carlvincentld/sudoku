import { CellCollection } from './cell-collection';
import { intersection } from './helpers/set.helper';

export class Cell {
	value: number;
	constructor(
		public x: number,
		public y: number,
		private column: CellCollection,
		private row: CellCollection,
		private section: CellCollection
	) {
		this.value = 0;
	}

	availableValues(): Set<number> {
		return this.section.intersectValues(
			this.column,
			this.row
		);
	}

	setValue(value: number): void {
		this.value = value;
		this.column.popValue(value);
		this.row.popValue(value);
		this.section.popValue(value);
	}

	unsetValue(): number {
		const value = this.value;
		this.column.pushValue(value);
		this.row.pushValue(value);
		this.section.pushValue(value);
		this.value = 0;
		return value;
	}
}
