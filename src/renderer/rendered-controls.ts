import { Grid } from "../grid/grid";
import { Operations } from "./operations";

export class RenderedControls {
    readonly el: HTMLElement;

    get selectedNumber(): number {
        return this._selectedNumber;
    }

    set selectedNumber(value: number) {
        this._numbers[value - 1]!.checked = true;
        this._selectedNumber = value;
    }

    private _selectedNumber = 1;
    private _isPencilMarking = true;

    private _numbers = new Array<HTMLInputElement>();

    constructor(grid: Grid, operations: Operations) {
        const controls = document.createElement('div');
        controls.classList.add('controls');
        controls.classList.add('pencil-marking');

        const pencil = document.createElement('button');
        pencil.classList.add('pencil');
        pencil.title = "Toggle between pen and pencil (shortcut: space)"
        pencil.addEventListener(
            'click',
            () => {
                this.togglePencilMarking();
            }
        );

        controls.appendChild(pencil);

        for (let value = 1; value <= grid.MAX_VALUE; value++) {
            const number = this.createNumber(value);
            number.title = `Selects number ${value} (shortcut: ${value})`;
            this._numbers.push(number);
            controls.appendChild(number);
        }

        const undo = document.createElement('button');
        undo.title = `Undoes the previous action (shortcut: CTRL+Z)`;
        undo.classList.add('undo');
        undo.disabled = true;
        undo.addEventListener(
            'click',
            () => { operations.undo(); }
        );

        const redo = document.createElement('button');
        undo.title = `Redoes the previous undone action (shortcut: CTRL+Y)`;
        redo.classList.add('redo');
        redo.disabled = true;
        redo.addEventListener(
            'click',
            () => { operations.redo(); }
        );

        operations.registerOnActionCompleted(() => {
            undo.disabled = !operations.canUndo();
            redo.disabled = !operations.canRedo();
        });

        controls.appendChild(undo);
        controls.appendChild(redo);

        this.el = controls;
    }

    isPencilMarking(): boolean {
        return this._isPencilMarking;
    }

    togglePencilMarking() {
        this._isPencilMarking = !this._isPencilMarking;
        this.el.classList.toggle('pencil-marking', this._isPencilMarking);
    }

    private createNumber(value: number): HTMLInputElement {
        const number = document.createElement('input');
        number.type = 'radio';
        number.name = 'value';
        number.value = `${value}`;
        number.checked = value === 1;
        number.style.setProperty('--pos-x', `${(value - 1) % 3}`);
        number.style.setProperty('--pos-y', `${Math.floor((value - 1) / 3)}`);

        number.addEventListener(
            'change',
            () => {
                this._selectedNumber = value;
            }
        );

        return number;
    }
}