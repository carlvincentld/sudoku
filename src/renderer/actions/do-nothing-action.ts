import { Action } from './action';

export class DoNothingAction extends Action {
	static Instance = new DoNothingAction();

	do(): void {}
	undo(): void {}
}
