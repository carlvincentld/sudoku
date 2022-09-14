import { Grid } from './grid';
import { Cell } from './cell';
import { shuffle } from '../helpers/array.helper';

const ITERATION_LIMIT = 10_000;

export class GridGenerator {
	iteration: number = 0;

	/**
	 * Generates a sudoku grid based on an existing grid.
	 * Revealed numbers in the initial grid might not be shown in the solved grid
	 *
	 * @param grid Initial grid to base the solution
	 * @returns Grid meant to be solved
	 */
	generate(grid: Grid): Grid {
		this.iteration = 0;

		const solution = this.solve(grid.clone());
		const cells = solution.cells;
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i]!;
			const value = cell.unsetValue();

			if (this.canSolveOtherWay(cells, i, value)) {
				cell.setValue(value);
			}
		}

		return solution;
	}

	/**
	 * Generates a solution for the given grid.
	 *
	 * @param grid Grid to modify to contain the solution
	 * @returns the solved grid
	 */
	private solve(grid: Grid): Grid {
		const cells = grid.cells;
		this.innerSolve(cells, grid.cells.length - 1);
		return grid;
	}

	/**
	 * Generates a solution for the given grid. Assumes ever cell at index > current index are set.
	 * Modifies the values of the cells.
	 *
	 * @param cells List of cells representing the grid
	 * @param index Index of the current cell
	 * @returns true if a solution has been found, false otherwise
	 */
	private innerSolve(cells: Cell[], index: number): boolean {
		this.iteration += 1;
		if (index === -1) {
			return true;
		}

		const cell = cells[index]!;
		if (cell.value !== null) {
			return this.innerSolve(cells, index - 1);
		}

		if (this.iteration > ITERATION_LIMIT) {
			return false;
		}

		const values = shuffle(cell.availableValues());
		for (let i = 0; i < values.length; i++) {
			const value = values[i]!;
			cell.setValue(value);
			if (this.innerSolve(cells, index - 1)) {
				return true;
			}
			cell.unsetValue();
		}

		return false;
	}

	/**
	 * Checks wether a solution exists, assuming every cell at index > current index are set
	 * Skips the given value for the current cell
	 *
	 * @param cells List of cells representing the grid
	 * @param index Index of the current cell
	 * @param selectedValue Value to skip during the validity check
	 * @returns true if there exists a solution for the given grid or the iteration limit has been achieved
	 */
	private canSolveOtherWay(cells: Cell[], index: number, selectedValue: number): boolean {
		const cell = cells[index]!;

		const values = cell.availableValues();
		for (let i = 0; i < values.length; i++) {
			const value = values[i]!;
			if (selectedValue === value) {
				continue;
			}

			cell.setValue(value);
			const solved = this.canSolve(cells, index - 1);
			cell.unsetValue();

			if (solved) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks wether a solution exists, assumes every cells at index > current index to be set
	 *
	 * @param cells List of cells representing the grid
	 * @param index Index of the current cell
	 * @returns true if there is a solution for the given grid or the iteration limit has been achieved
	 */
	private canSolve(cells: Cell[], index: number): boolean {
		this.iteration += 1;
		if (index === -1) {
			return true;
		}

		const cell = cells[index]!;
		if (cell.value !== null) {
			return this.canSolve(cells, index - 1);
		}

		if (this.iteration > ITERATION_LIMIT) {
			return true;
		}

		const values = cell.availableValues();
		for (let i = 0; i < values.length; i++) {
			const value = values[i]!;
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
