import { Cell, Position } from './cell';
import { CellCollection } from './cell-collection';
import { range } from '../helpers/array.helper';

export type CellsByPosition = ReadonlyMap<Position, Cell>;

export class Grid {
	protected _columns: CellCollection[];
	protected _rows: CellCollection[];
	protected _sections: CellCollection[];

	readonly cells: Cell[];
	readonly cellsByPosition: CellsByPosition;
	readonly MAX_VALUE: number;

	constructor(
		public readonly WIDTH: number,
		public readonly HEIGHT: number,
		public readonly SECTION_COUNT: number
	) {
		if (
			this.WIDTH !== 9
			|| this.HEIGHT !== 9
			|| this.SECTION_COUNT !== 9) {
			throw new Error('Only 9x9 gris of 9 sections are supported');
		}

		const valueCount = this.WIDTH * this.HEIGHT / this.SECTION_COUNT;
		this.MAX_VALUE = valueCount;

		this._columns = range(this.WIDTH).map((i) => new CellCollection(valueCount, i));
		this._rows = range(this.HEIGHT).map((i) => new CellCollection(valueCount, i));
		this._sections = range(this.SECTION_COUNT).map((i) => new CellCollection(valueCount, i));

		this.cells = range(this.WIDTH)
			.flatMap(x => range(this.HEIGHT).map(y => {
				return new Cell(
					x,
					y,
					this._columns[x]!,
					this._rows[y]!,
					this._sections[
						Math.floor(x / 3)
						+ 3 * Math.floor(y / 3)]!);
			}));
		this.cellsByPosition = new Map(
			this.cells.map(x => [x.position(), x])
		);
	}

	clone(): Grid {
		const result = new Grid(this.WIDTH, this.HEIGHT, this.SECTION_COUNT);
		const ordering = (a: Cell, b: Cell) => { 
			return a.x !== b.x ? b.x - a.x : b.y - a.y;
		};

		result.cells.sort(ordering);
		const cells = Array.from(this.cells).sort(ordering);
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i]!;
			if (cell.value === null) {
				continue;
			}

			result.cells[i]!.setValue(cell.value);
		}

		return result;
	}

	prettyFormat(): string {
		const grid = range(this.HEIGHT).map(() => range(this.WIDTH)) as unknown as string[][];
		for (let i = 0; i < this.cells.length; i++) {
			const cell = this.cells[i]!;
			grid[cell.y]![cell.x]! = `${cell.value ?? ' '}`;
		}

		let result = "";
		for (let i = 0; i < grid.length; i++) {
			const row = grid[i]!;
			for (let j = 0; j < row.length; j++) {
				const value = row[j]!;
				result += `${value}, `;
			}
			result += '\n';
		}
		return result;
	}

	prettyFormatSection(): string  {
		const grid = range(this.HEIGHT).map(() => range(this.WIDTH)) as unknown as string[][];
		for (let i = 0; i < this.cells.length; i++) {
			const cell = this.cells[i]!;
			grid[cell.y]![cell.x]! = `${cell.section.ord}`;
		}

		let result = "";
		for (let i = 0; i < grid.length; i++) {
			const row = grid[i]!;
			for (let j = 0; j < row.length; j++) {
				const value = row[j]!;
				result += `${value}, `;
			}
			result += '\n';
		}
		return result;
	}
}

