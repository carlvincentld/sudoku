import { Grid } from './grid/grid';
import { GridGenerator } from './grid/grid-generator';
import { JigsawGrid } from './grid/jigsaw-grid';
import { range } from './helpers/array.helper';
import { cyrb128, xoshiro128ss } from './helpers/random.helper';
import { RenderedSudokuGrid } from './renderer/rendered-sudoku-grid';

const MAX_TRY = 100;

function sync(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

function generateSeed(): string {
	const hexCharacters = '0123456789ABCDEF';
	return range(16)
		.map(() => hexCharacters.charAt(Math.floor(Math.random() * hexCharacters.length)))
		.join('');
}

function main() {
	const seedElement = document.getElementById('seed') as HTMLInputElement;

	let seed = seedElement.value = generateSeed();

	const game = document.getElementById('game')!;
	createGame('classical', game, seed);

	const newClassical = document.getElementById('new-game-classical')!;
	newClassical.addEventListener(
		'click',
		() => setTimeout(
			() => {
				seed = seedElement.value === seed
					? generateSeed()
					: seedElement.value;

				seedElement.value = seed;

				createGame('classical', game, seed);
			}, 0));

	const newJigsaw = document.getElementById('new-game-jigsaw')!;
	newJigsaw.addEventListener(
		'click',
		() => setTimeout(
			() => {
				seed = seedElement.value === seed
					? generateSeed()
					: seedElement.value;

				seedElement.value = seed;

				createGame('jigsaw', game, seed);
			}, 0));
}

async function createGame(gameType: 'jigsaw' | 'classical', container: HTMLElement, seed?: string): Promise<void> {
	const width = 9;
	const height = 9;
	const sectionCount = 9;

	const random = seed ? xoshiro128ss(...cyrb128(seed)) : Math.random;

	for (let i = 1; i <= MAX_TRY; i++) {
		container.innerHTML = `Trying to generate a grid: ${i} of ${MAX_TRY} tries;`

		await sync();

		const grid = gameType === 'jigsaw'
			? new JigsawGrid(width, height, sectionCount, random)
			: new Grid(width, height, sectionCount);
		const generator = new GridGenerator(random);
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
