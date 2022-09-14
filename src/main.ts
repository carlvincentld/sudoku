import { Grid } from './grid/grid';
import { GridGenerator } from './grid/grid-generator';
import { JigsawGrid } from './grid/jigsaw-grid';
import { RenderedSudokuGrid } from './renderer/rendered-sudoku-grid';

const MAX_TRY = 100;

function sync(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

function main() {
	const game = document.getElementById('game')!;

	const newClassical = document.getElementById('new-game-classical')!;
	newClassical.addEventListener('click', () => setTimeout(() => createGame('classical', game), 0));

	const newJigsaw = document.getElementById('new-game-jigsaw')!;
	newJigsaw.addEventListener('click', () => setTimeout(() => createGame('jigsaw', game), 0));
}

async function createGame(gameType: 'jigsaw' | 'classical', container: HTMLElement): Promise<void> {
	const width = 9;
	const height = 9;
	const sectionCount = 9;

	for (let i = 1; i <= MAX_TRY; i++) {
		container.innerHTML = `Trying to generate a grid: ${i} of ${MAX_TRY} tries;`

		await sync();

		const grid = gameType === 'jigsaw'
			? new JigsawGrid(width, height, sectionCount)
			: new Grid(width, height, sectionCount);
		const generator = new GridGenerator();
		const [canSolve, generated] = generator.generate(grid);

		if (!canSolve) {
			continue;
		}

		const rendered = new RenderedSudokuGrid(generated);
		container.innerHTML = '';
		container.appendChild(rendered.el);
		console.log(`Generated a ${grid.constructor.name} after ${i} tries.`);
		return;
	}

	container.innerHTML = `Failed to generate a ${gameType} grid after ${MAX_TRY} tries;`;
}


if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main);
} else {
	main();
}
