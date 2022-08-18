import { Cell } from './cell';
import { CellCollection } from './cell-collection';
import { range } from './helpers/array.helper';

export class Grid {
	private _columns: CellCollection[];
	private _rows: CellCollection[];
	private _sections: CellCollection[];

	cells: Cell[];

	constructor(
		private _width: number,
		private _height: number,
		private _sectionCount: number
	) {
		if (
			this._width !== 9
			|| this._height !== 9
			|| this._sectionCount !== 9) {
			throw new Error('Only 9x9 gris of 9 sections are supported');
		}

		const valueCount = this._width * this._height / this._sectionCount;

		this._columns = range(this._width).map(() => new CellCollection(valueCount));
		this._rows = range(this._height).map(() => new CellCollection(valueCount));
		this._sections = range(this._sectionCount).map(() => new CellCollection(valueCount));

		this.cells = range(this._width)
			.flatMap(x => range(this._height).map(y => {
				return new Cell(
					x,
					y,
					this._columns[x]!,
					this._rows[y]!,
					this._sections[
						Math.floor(x / 3)
						+ 3 * Math.floor(y / 3)]!);
			}));
	}

	clone(): Grid {
		const result = new Grid(this._width, this._height, this._sectionCount);
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
		const grid = range(this._height).map(() => range(this._width)) as unknown as string[][];
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

	render(parent: HTMLElement): void {
		const cells = new Map(this.cells.map(c =>
			[`${c.y},${c.x}`, c]));

		const table = document.createElement('table');
		for (let y = 0; y < this._height; y++) {
			const tr = document.createElement('tr');
			table.appendChild(tr);

			for (let x = 0; x < this._width; x++) {
				const td = document.createElement('td');
				tr.appendChild(td);

				const cell = cells.get(`${y},${x}`);
				if (cell!.value === null) {
					const input = document.createElement('input');
					input.type = 'text';
					td.appendChild(input);
				} else {
					const span = document.createElement('span');
					span.classList.add('constant');
					span.textContent = `${cell!.value}`;
					td.appendChild(span);
				}
			}
		}

		parent.appendChild(table);
	}
}

