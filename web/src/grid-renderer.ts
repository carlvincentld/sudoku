import { Grid } from './grid';

export class GridRenderer {
	render(grid: Grid, parent?: HTMLElement): void {
		const buttons = this.createControls(grid);
		const table = this.createTable(grid, buttons.selectedNumber, buttons.isPencilMarking);
		
		const wrapper = document.createElement('div');
		wrapper.style.setProperty('--max-x', `3`);
		wrapper.style.setProperty('--max-y', `${Math.ceil(grid.MAX_VALUE / 3)}`);

		wrapper.classList.add('sudoku');
		wrapper.appendChild(table);
		wrapper.appendChild(buttons.el);

		parent ??= document.body;
		parent.appendChild(wrapper);
	}

	/// Creates a serie of buttons for selecting numbers and pencil markings
	private createControls(grid: Grid): { 
		el: HTMLElement, 
		selectedNumber: () => number, 
			isPencilMarking: () => boolean 
	} {
		let selectedNumber = 1;
		let isPencilMarking = true;

		const line = document.createElement('div');
		line.classList.add('controls');

		const pencil = document.createElement('button');
		line.classList.add('pencil-marking');
		pencil.addEventListener(
			'click', 
			() => {
				isPencilMarking = !isPencilMarking;
				line.classList.toggle('pencil-marking', isPencilMarking);
			}
		);

		line.appendChild(pencil);

		for (let i = 1; i <= grid.MAX_VALUE; i++) {
			const number = document.createElement('input');
			number.type = 'radio';
			number.name = 'value';
			number.value = `${i}`;
			number.checked = i === 1;
			number.style.setProperty('--pos-x', `${(i - 1) % 3}`);
			number.style.setProperty('--pos-y', `${Math.floor((i - 1) / 3)}`);

			number.addEventListener(
				// ???: change
				'click', 
				() => {
					selectedNumber = i;
				}
			);

			line.appendChild(number);
		}

		return {
			el: line,
			selectedNumber: () => selectedNumber,
				isPencilMarking: () => isPencilMarking
		};
	}

	// Creates the table that is going to contain the different cells
	private createTable(
		grid: Grid, 
		selectedNumber: () => number, 
			isPencilMarking: () => boolean
	): HTMLTableElement{
		const cells = new Map(grid.cells.map(c => [`${c.y},${c.x}`, c]));

		const table = document.createElement('table');
		for (let y = 0; y < grid.HEIGHT; y++) {
			const tr = document.createElement('tr');
			table.appendChild(tr);

			for (let x = 0; x < grid.WIDTH; x++) {
				const td = document.createElement('td');
				tr.appendChild(td);

				const cell = cells.get(`${y},${x}`)!;
				if (cell.value === null) {
					let value: number | null = null;
					const markings = new Map<number, HTMLElement>();
					td.addEventListener(
						'click', 
						() => {
							const number = selectedNumber();
							if (isPencilMarking() && value !== null) {
								td.innerHTML = ``;
								value = null;
							} 

							if (isPencilMarking()) {
								if (markings.has(number)) {
									const marking = markings.get(number)!;
									td.removeChild(marking);
									markings.delete(number);
								} else {
									const marking = document.createElement('span');
									marking.style.setProperty('--pos-x', `${(number - 1) % 3}`);
									marking.style.setProperty('--pos-y', `${Math.floor((number - 1) / 3)}`);

									marking.textContent = `${number}`;
									td.appendChild(marking);

									markings.set(number, marking);
								}
							} else if (value === number) {
								value = null;
								td.innerHTML = ``;
							} else {
								value = number;
								td.innerHTML = `${number}`;

								markings.clear();
							}
						}
					);
				} else {
					td.classList.add('constant');
					td.textContent = `${cell.value}`;
				}
			}
		}

		return table;
	}
}
