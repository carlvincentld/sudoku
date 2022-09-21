import { Grid } from '../grid/grid';
import { Operations } from './operations';
import { SVGGenerator } from './svg-generator';

export class RenderedControls {
	readonly el: HTMLElement;

	get selectedNumber(): number {
		return this._selectedNumber;
	}

	set selectedNumber(value: number) {
		this._numbers[this._selectedNumber - 1]!.classList.remove('active');
		this._selectedNumber = value;
		this._numbers[this._selectedNumber - 1]!.classList.add('active');
	}

	private _selectedNumber = 1;
	private _isPencilMarking = true;

	private _numbers = new Array<HTMLButtonElement>();
	private _svgGenerator = new SVGGenerator();

	constructor(grid: Grid, operations: Operations, onFillMarkings: () => void) {
		const controls = document.createElement('div');
		controls.classList.add('controls');
		controls.classList.add('pencil-mode');

		const pencil = this.createPencil();

		controls.appendChild(pencil);

		for (let value = 1; value <= grid.MAX_VALUE; value++) {
			const number = this.createNumber(value);
			number.title = `Selects number ${value} (shortcut: ${value})`;
			this._numbers.push(number);
			controls.appendChild(number);
		}

		const undo = this.createUndoButton(operations);
		const redo = this.createRedoButton(operations);
		operations.registerOnActionCompleted(() => {
			undo.disabled = !operations.canUndo();
			redo.disabled = !operations.canRedo();
		});

		controls.appendChild(undo);
		controls.appendChild(redo);

		const fillMarkings = this.createFillMarkings();
		fillMarkings.addEventListener('click', onFillMarkings);
		controls.append(fillMarkings);

		this.el = controls;
	}

	isPencilMarking(): boolean {
		return this._isPencilMarking;
	}

	togglePencilMarking() {
		this._isPencilMarking = !this._isPencilMarking;
		this.el.classList.toggle('pencil-mode', this._isPencilMarking);
		this.el.classList.toggle('pen-mode', !this._isPencilMarking);
	}

	private createNumber(value: number): HTMLButtonElement {
		const button = document.createElement('button');
		// TODO: Support letters for numbers greater than 9
		button.title = `Select ${value} (shortcut: ${value})`;
		button.classList.add('pencil-dependent');

		if (value === this._selectedNumber) {
			button.classList.add('active');
		}

		const svg = this._svgGenerator.createSVG();
		svg.appendChild(this._svgGenerator.createPenMarking(value));
		svg.appendChild(this._svgGenerator.createPencilMarking(value, 3, 3));

		button.appendChild(svg);
		button.addEventListener('click', () => {
			this.selectedNumber = value;
		});

		return button;
	}

	private createPencil() {
		const pencil = document.createElement('button');
		pencil.classList.add('pencil');
		pencil.title = 'Toggle between pen and pencil (shortcut: space)';

		pencil.addEventListener('click', () => {
			this.togglePencilMarking();
		});

		const svg = this._svgGenerator.createSVG();
		svg.appendChild(this._svgGenerator.createCustomText('&#x270E'));
		pencil.appendChild(svg);

		return pencil;
	}

	private createUndoButton(operations: Operations) {
		const undo = document.createElement('button');
		undo.title = `Undo (shortcut: CTRL+Z)`;
		undo.classList.add('undo');

		undo.disabled = true;
		undo.addEventListener('click', () => {
			operations.undo();
		});

		const svg = this._svgGenerator.createSVG();
		svg.appendChild(this._svgGenerator.createCustomText('&#x293A'));
		undo.appendChild(svg);

		return undo;
	}

	private createRedoButton(operations: Operations) {
		const redo = document.createElement('button');
		redo.title = `Redo (shortcut: CTRL+Y)`;
		redo.classList.add('redo');

		redo.disabled = true;
		redo.addEventListener('click', () => {
			operations.redo();
		});

		const svg = this._svgGenerator.createSVG();
		const text = this._svgGenerator.createCustomText('&#x293A');
		text.setAttribute('transform-origin', 'center');
		text.setAttribute('transform', 'scale(-1, 1)');
		svg.appendChild(text);
		redo.appendChild(svg);

		return redo;
	}

	private createFillMarkings(): HTMLButtonElement {
		const button = document.createElement('button');
		button.title = `Fill all markings`;
		button.classList.add('pencil-independent');

		const svg = this._svgGenerator.createSVG();
		for (let i = 0; i < 9; i++) {
			svg.appendChild(this._svgGenerator.createPencilMarking(i + 1, 3, 3));
		}

		button.appendChild(svg);

		return button;
	}
}
