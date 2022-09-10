import { Cell } from "../cell";
import { CellCollection } from "../cell-collection";

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
        private _control: {
            selectedNumber: () => number,
            isPencilMarking: () => boolean
        }
    ) {
        this.column = cell.column;
        this.row = cell.row;
        this.section = cell.section;

        this.value = cell.value;
        this._markings = new Map<number, HTMLElement>();
        this._onValueChanged = [];

        this.el = document.createElement('td');

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

    private onValueChanged(): void {
        this._onValueChanged.forEach(fn => fn(this));
    }

	private onClick(): void {
		const number = this._control.selectedNumber();
		const isMarking = this._control.isPencilMarking();

		if (isMarking) {
			if (this.value !== null) {
				this.el.innerHTML = ``;
				this.value = null;

                this.onValueChanged();
			}

			this.toggleMarking(number);
			return;
		}

		if (this.value === number) {
			this.value = null;
			this.el.innerHTML = ``;
		} else {
			this.value = number;
			this.el.innerHTML = `${number}`;

			this._markings.clear();
		}

        this.onValueChanged();
	}

	private toggleMarking(number: number): void {
		if (this._markings.has(number)) {
			const marking = this._markings.get(number)!;
			this.el.removeChild(marking);
			this._markings.delete(number);
			return;
		}

		const marking = document.createElement('span');
		marking.style.setProperty('--pos-x', `${(number - 1) % 3}`);
		marking.style.setProperty('--pos-y', `${Math.floor((number - 1) / 3)}`);

		marking.textContent = `${number}`;
		this.el.appendChild(marking);

		this._markings.set(number, marking);
	}
}