import { Cell } from '../grid/cell';
import { CellCollection } from '../grid/cell-collection';
import { Grid } from '../grid/grid';
import { Action } from './actions/action';
import { CompositeAction } from './actions/composite-action';
import { DoNothingAction } from './actions/do-nothing-action';
import {
	MarkingAddAction,
	RemoveMarkingAction as MarkingRemoveAction,
} from './actions/markings-action';
import { PenEraseAction, PenWriteAction } from './actions/pen-action';
import { Operations } from './operations';
import { RenderedControls } from './rendered-controls';
import { SVGGenerator } from './svg-generator';

export class RenderedCell {
	readonly el: HTMLTableCellElement;

	readonly column: CellCollection;
	readonly row: CellCollection;
	readonly section: CellCollection;

	value: number | null;

	private _isConstant: boolean;
	private _markings: Map<number, SVGTextElement>;
	private _onValueChanged: Array<(cell: RenderedCell) => void>;
	private _svgGenerator = new SVGGenerator();
	private _svg: SVGElement;

	constructor(
		cell: Cell,
		private _grid: Grid,
		private _operations: Operations,
		private _control: RenderedControls
	) {
		this.column = cell.column;
		this.row = cell.row;
		this.section = cell.section;

		this.value = cell.value;
		this._markings = new Map<number, SVGTextElement>();
		this._onValueChanged = [];

		this.el = document.createElement('td');
		this._svg = this._svgGenerator.createSVG();
		this.el.appendChild(this._svg);

		this.el.setAttribute('section', `${cell.section.ord}`);
		if (
			_grid.cellsByPosition.get(cell.position(+1, 0))?.section !== cell.section
		) {
			this.el.classList.add('section-edge-top');
		}
		if (
			_grid.cellsByPosition.get(cell.position(-1, 0))?.section !== cell.section
		) {
			this.el.classList.add('section-edge-bottom');
		}
		if (
			_grid.cellsByPosition.get(cell.position(0, +1))?.section !== cell.section
		) {
			this.el.classList.add('section-edge-left');
		}
		if (
			_grid.cellsByPosition.get(cell.position(0, -1))?.section !== cell.section
		) {
			this.el.classList.add('section-edge-right');
		}

		if ((this._isConstant = cell.value !== null)) {
			this.el.classList.add('constant');
			const marking = this._svgGenerator.createPenMarking(cell.value, true);
			this._svg.appendChild(marking);
			return;
		}

		this.el.addEventListener('click', this.onClick.bind(this));
	}

	registerOnValueChanged(fn: (cell: RenderedCell) => void) {
		this._onValueChanged.push(fn);
	}

	removeMaking(number: number): void {
		if (!this._markings.has(number)) {
			return;
		}

		const marking = this._markings.get(number)!;

		this._svg.removeChild(marking);
		this._markings.delete(number);
	}

	addMarking(number: number): void {
		if (this._markings.has(number)) {
			return;
		}

		const marking = this._svgGenerator.createPencilMarking(number, 3, 3);

		this._svg.appendChild(marking);
		this._markings.set(number, marking);
	}

	writeValue(number: number | null): void {
		this.value = number;

		if (number === null) {
			this._svg.childNodes.forEach((x) => this._svg.removeChild(x));
		} else {
			this._svg.appendChild(this._svgGenerator.createPenMarking(number));
		}

		this.onValueChanged();
	}

	fillMarkingsAction(): Action {
		if (this._isConstant) {
			return DoNothingAction.Instance;
		}

		return new MarkingAddAction(
			this,
			this._grid.validValues().filter((x) => !this._markings.has(x))
		);
	}

	private onValueChanged(): void {
		this._onValueChanged.forEach((fn) => fn(this));
	}

	private onClick(): void {
		const number = this._control.selectedNumber;
		const isMarking = this._control.isPencilMarking();

		if (!isMarking) {
			if (this.value === number) {
				this._operations.do(new PenEraseAction(this, this.value));
			} else {
				this._operations.do(
					new CompositeAction(
						new MarkingRemoveAction(this, Array.from(this._markings.keys())),
						new PenWriteAction(this, number, this.value)
					)
				);
				this._markings.clear();
			}
		} else if (this.value !== null) {
			this._operations.do(
				new CompositeAction(
					new PenEraseAction(this, this.value),
					new MarkingAddAction(this, [number])
				)
			);
		} else if (this._markings.has(number)) {
			this._operations.do(new MarkingRemoveAction(this, [number]));
		} else {
			this._operations.do(new MarkingAddAction(this, [number]));
		}
	}
}
