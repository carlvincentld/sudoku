import { CellCollection } from "../grid/cell-collection";
import { Grid } from "../grid/grid";
import { groupBy } from "../helpers/array.helper";
import { Operations } from "./operations";
import { RenderedCell } from "./rendered-cell";
import { RenderedControls } from "./rendered-controls";

export class RenderedSudokuGrid {
	readonly el: HTMLElement;

	private _operations: Operations;
	private _renderedCells: Array<RenderedCell>;

	private _cellsByColumn: Map<CellCollection, RenderedCell[]>;
	private _cellsByRow: Map<CellCollection, RenderedCell[]>;
	private _cellsBySection: Map<CellCollection, RenderedCell[]>;

	constructor(grid: Grid) {
		this._operations = new Operations();
		this._renderedCells = new Array<RenderedCell>();

		const controls = new RenderedControls(grid, this._operations);
		const table = this.createTable(grid, controls);

		this._cellsByColumn = groupBy(this._renderedCells, (x) => x.column);
		this._cellsByRow = groupBy(this._renderedCells, (x) => x.row);
		this._cellsBySection = groupBy(this._renderedCells, (x) => x.section);

		const wrapper = document.createElement('div');
		wrapper.tabIndex = 0;
		wrapper.style.setProperty('--max-x', `3`);
		wrapper.style.setProperty('--max-y', `${Math.ceil(grid.MAX_VALUE / 3)}`);

		wrapper.classList.add('sudoku');
		wrapper.appendChild(table);
		wrapper.appendChild(controls.el);

		wrapper.addEventListener(
			'keydown',
			(e) => {
				if (e.repeat) {
					return;
				}

				if (1 <= +e.key && +e.key <= grid.MAX_VALUE) {
					controls.selectedNumber = +e.key;
					e.preventDefault();
				} else if (e.key === " ") {
					controls.togglePencilMarking();
					e.preventDefault();
				} else if (e.key === "z" && e.ctrlKey) {
					// TODO: Add a warning to tell the user can't undo
					if (this._operations.canUndo())  {
						this._operations.undo();
					}
				} else if (e.key === "y" && e.ctrlKey) {
					// TODO: Add a warning to tell the user can't redo
					if (this._operations.canRedo())  {
						this._operations.redo();
					}
				}
			});

		this.el = wrapper;
	}

	private createTable(grid: Grid, control: RenderedControls): HTMLTableElement {
		const cells = new Map(grid.cells.map(c => [`${c.y},${c.x}`, c]));

		const table = document.createElement('table');
		for (let y = 0; y < grid.HEIGHT; y++) {
			const tr = document.createElement('tr');
			table.appendChild(tr);

			for (let x = 0; x < grid.WIDTH; x++) {
				const cell = cells.get(`${y},${x}`)!
				const renderedCell = new RenderedCell(cell, grid, this._operations, control);

				renderedCell.registerOnValueChanged(this.refreshValidation.bind(this));
				this._renderedCells.push(renderedCell);
				tr.appendChild(renderedCell.el);
			}
		}

		return table;
	}

	private refreshValidation(cell: RenderedCell): void {
		this.validateUniqueness(this._cellsByRow.get(cell.row)!, 'row');
		this.validateUniqueness(this._cellsByColumn.get(cell.column)!, 'column');
		this.validateUniqueness(this._cellsBySection.get(cell.section)!, 'section');
	}

	private validateUniqueness(cells: RenderedCell[], collection: 'row' | 'column' | 'section'): void {
		const cellsByValue = groupBy(cells, (x) => x.value);

		cellsByValue.forEach((grouping, value) => {
			if (value !== null && grouping.length > 1) {
				grouping.map(x => x.el)
					.forEach(x => x.classList.add(`invalid-${collection}`));
			} else {
				grouping.map(x => x.el)
					.forEach(x => x.classList.remove(`invalid-${collection}`));
			}
		});
	}
}