import { Cell } from "../grid/cell";
import { CellCollection } from "../grid/cell-collection";
import { Grid } from "../grid/grid";
import { CompositeAction } from "./actions/composite-action";
import { MarkingAddAction, RemoveMarkingAction as MarkingRemoveAction } from "./actions/markings-action";
import { PenEraseAction, PenWriteAction } from "./actions/pen-action";
import { Operations } from "./operations";
import { RenderedControls } from "./rendered-controls";

export class RenderedCell {
	readonly el: HTMLTableCellElement;

	readonly column: CellCollection;
	readonly row: CellCollection;
	readonly section: CellCollection;

	value: number | null;
	private _markings: Map<number, HTMLElement>;
	private _onValueChanged: Array<(cell: RenderedCell) => void>;

	constructor(
		cell: Cell,
		grid: Grid,
		private _operations: Operations,
		private _control: RenderedControls
	) {
		this.column = cell.column;
		this.row = cell.row;
		this.section = cell.section;

		this.value = cell.value;
		this._markings = new Map<number, HTMLElement>();
		this._onValueChanged = [];

		this.el = document.createElement('td');

		this.el.setAttribute('section', `${cell.section.ord}`);
		if (grid.cellsByPosition.get(cell.position(+1, 0))?.section !== cell.section) {
			this.el.classList.add('section-edge-top');
		}
		if (grid.cellsByPosition.get(cell.position(-1, 0))?.section !== cell.section) {
			this.el.classList.add('section-edge-bottom');
		}
		if (grid.cellsByPosition.get(cell.position(0, +1))?.section !== cell.section) {
			this.el.classList.add('section-edge-left');
		}
		if (grid.cellsByPosition.get(cell.position(0, -1))?.section !== cell.section) {
			this.el.classList.add('section-edge-right');
		}

		if (cell.value !== null) {
			this.el.classList.add('constant');
			this.el.textContent = `${cell.value}`;
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
		this.el.removeChild(marking);
		this._markings.delete(number);
	}

	addMarking(number: number): void {
		if (this._markings.has(number)) {
			return;
		}

		const marking = document.createElement('span');
		marking.style.setProperty('--pos-x', `${(number - 1) % 3}`);
		marking.style.setProperty('--pos-y', `${Math.floor((number - 1) / 3)}`);

		marking.textContent = `${number}`;
		this.el.appendChild(marking);

		this._markings.set(number, marking);
	}

	writeValue(number: number | null): void {
		this.value = number;
		this.el.innerHTML = this.value === null
			? ''
			: `${number}`;

		this.onValueChanged();
	}

	private onValueChanged(): void {
		this._onValueChanged.forEach(fn => fn(this));
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
					));
				this._markings.clear();
			}
		} else if (this.value !== null) {
			this._operations.do(
				new CompositeAction(
					new PenEraseAction(this, this.value),
					new MarkingAddAction(this, [number])
				));
		} else if (this._markings.has(number)) {
			this._operations.do(
				new MarkingRemoveAction(this, [number])
			)
		} else {
			this._operations.do(
				new MarkingAddAction(this, [number])
			);
		}
	}
}