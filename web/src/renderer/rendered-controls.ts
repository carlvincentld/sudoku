import { Grid } from "../grid";

export class RenderedControls {
    readonly el: HTMLElement;

    private _selectedNumber = 1;
    private _isPencilMarking = true;

    constructor(grid: Grid) {
        const line = document.createElement('div');
        line.classList.add('controls');

		const pencil = document.createElement('button');
		line.classList.add('pencil-marking');
		pencil.addEventListener(
			'click',
			() => {
				this._isPencilMarking = !this._isPencilMarking;
				line.classList.toggle('pencil-marking', this._isPencilMarking);
			}
		);

        line.appendChild(pencil);

        for (let value = 1; value <= grid.MAX_VALUE; value++) {
			line.appendChild(this.createNumber(value));
        }

        this.el = line;
    }

    selectedNumber(): number {
        return this._selectedNumber;
    }

    isPencilMarking(): boolean {
        return this._isPencilMarking;
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
            // ???: change
            'click',
            () => {
                this._selectedNumber = value;
            }
        );

        return number;
    }
}