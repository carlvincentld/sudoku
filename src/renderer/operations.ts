import { Action } from "./actions/action";

export class Operations {
    private _previouses: Action[] = [];
    private _nexts: Action[] = [];

    private _callbacks: Array<() => void> = [];

    canUndo(): boolean {
        return this._previouses.length !== 0;
    }

    undo(): void {
        if (this._previouses.length === 0) {
            throw new Error(`No action can be undone`);
        }

        const action = this._previouses.pop()!;
        action.undo();
        this._nexts.push(action);

        this.onActionCompleted();
    }

    canRedo(): boolean {
        return this._nexts.length !== 0;
    }

    redo(): void {
        if (this._nexts.length === 0) {
            throw new Error(`No action can be redone`);
        }

        const action = this._nexts.pop()!;
        action.do();
        this._previouses.push(action);

        this.onActionCompleted();
    }

    do(action: Action): void {
        this._previouses.push(action);
        action.do();
        this._nexts.splice(0, this._nexts.length);

        this.onActionCompleted();
    }

    registerOnActionCompleted(callback: () => void): void {
        this._callbacks.push(callback);
    }

    private onActionCompleted(): void {
        this._callbacks.forEach(fn => fn());
    }
}
