import { RenderedCell } from '../rendered-cell';
import { Action } from './action';

export class PenWriteAction extends Action {
	constructor(
		private _cell: RenderedCell,
		private _number: number | null,
		private _previousNumber: number | null
	) {
		super();
	}

	do(): void {
		this._cell.writeValue(this._number);
	}

	undo(): void {
		this._cell.writeValue(this._previousNumber);
	}
}

export class PenEraseAction extends PenWriteAction {
	constructor(cell: RenderedCell, previousNumber: number | null) {
		super(cell, null, previousNumber);
	}
}
