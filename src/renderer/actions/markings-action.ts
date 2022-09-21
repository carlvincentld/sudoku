import { RenderedCell } from '../rendered-cell';
import { Action } from './action';

export class MarkingAddAction extends Action {
	constructor(private _cell: RenderedCell, private _markings: number[]) {
		super();
	}

	do(): void {
		this._markings.forEach((x) => {
			this._cell.addMarking(x);
		});
	}

	undo(): void {
		this._markings.forEach((x) => {
			this._cell.removeMaking(x);
		});
	}
}

export class RemoveMarkingAction extends MarkingAddAction {
	constructor(cell: RenderedCell, markings: number[]) {
		super(cell, markings);
	}

	override do(): void {
		super.undo();
	}

	override undo(): void {
		super.do();
	}
}
