import { CellCollection } from './cell-collection';

export class Cell {
	value: number | null;
	constructor(
		public x: number,
		public y: number,
		public readonly column: CellCollection,
		public readonly row: CellCollection,
		public readonly section: CellCollection
	) {
		this.value = null;
	}

	availableValues(): number[] {
		return this.section.intersect(
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
		const value = this.value!;
		this.column.pushValue(value);
		this.row.pushValue(value);
		this.section.pushValue(value);
		this.value = null;
		return value;
	}
}
