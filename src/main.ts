import { GridGenerator } from './grid/grid-generator';
import { JigsawGrid } from './grid/jigsaw-grid';
import { RenderedSudokuGrid } from './renderer/rendered-sudoku-grid';

function main() {
	const width = 9;
	const height = 9;
	const sectionCount = 9;

	const grid = new JigsawGrid(width, height, sectionCount);
	const generator = new GridGenerator();
	const generated = generator.generate(grid);

	const rendered = new RenderedSudokuGrid(generated);
	document.body.appendChild(rendered.el);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main);
} else {
	main();
}
