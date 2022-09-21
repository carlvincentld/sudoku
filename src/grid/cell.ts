import { CellCollection } from './cell-collection';

export type Position = `${number},${number}`;

export class Cell {
	value: number | null;
	constructor(
		public readonly x: number,
		public readonly y: number,
		public column: CellCollection,
		public row: CellCollection,
		public section: CellCollection
	) {
		this.value = null;
	}

	availableValues(): number[] {
		return this.section.intersect(this.column, this.row);
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

	position(offsetY: number = 0, offsetX: number = 0): Position {
		return `${this.y - offsetY},${this.x - offsetX}`;
	}
}
