import { Grid } from './grid';
import { Cell } from './cell';
import { shuffle } from './helpers/array.helper';

export class GridGenerator {
	iteration: number = 0;
	limit = 100_000;

	tryGenerate(grid: Grid): Grid {
		const solution = this.solve(grid.clone());
		const cells = shuffle(grid.cells);
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			const cellValue = cell.unsetValue();

			let canSolveOtherWay = false;
			for (const value of cell.availableValues()) {
				if (cellValue === value) {
					continue;
				}

				cell.setValue(value);
				canSolveOtherWay = canSolveOtherWay || this.canSolve(cells, i - 1);
				cell.unsetValue();
				if (canSolveOtherWay) {
					break;
				}
			}

			if (canSolveOtherWay) {
				cell.setValue(cellValue);
			}
		}

		return grid;
	}

	/**
	 * Solves a sudoku grid with a random possible solution
	 */
	private solve(grid: Grid): Grid {
		const cells = shuffle(grid.cells);
		this.innerSolve(cells, grid.cells.length - 1);
		return grid;
	}

	private innerSolve(cells: Cell[], index: number): boolean {
		this.iteration += 1;
		if (index === -1) {
			return true;
		}

		const cell = cells[index];
		if (cell.value !== 0) {
			return this.innerSolve(cells, index - 1);
		}

		if (this.iteration > this.limit) {
			return false;
		}

		for (const value of shuffle(cell.availableValues())) {
			cell.setValue(value);
			if (this.innerSolve(cells, index - 1)) {
				return true;
			}
			cell.unsetValue();
		}

		return false;
	}

	private canSolve(cells: Cell[], index: number): boolean {
		this.iteration += 1;
		if (index === -1) {
			return true;
		}

		const cell = cells[index];
		if (cell.value !== 0) {
			return this.canSolve(cells, index - 1);
		}

		if (this.iteration > this.limit) {
			return false;
		}


		for (const value of shuffle(cell.availableValues())) {
			cell.setValue(value);
			if (this.canSolve(cells, index - 1)) {
				cell.unsetValue();
				return true;
			}
			cell.unsetValue();
		}

		return false;
	}
}
