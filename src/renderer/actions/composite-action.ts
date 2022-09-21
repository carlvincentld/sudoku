import { Action } from './action';

export class CompositeAction extends Action {
	private _actions: Action[];

	constructor(...args: Action[]) {
		super();
		this._actions = args;
	}

	do() {
		for (let i = 0; i < this._actions.length; i++) {
			this._actions[i]!.do();
		}
	}

	undo(): void {
		for (let i = this._actions.length - 1; i >= 0; i--) {
			this._actions[i]!.undo();
		}
	}
}
