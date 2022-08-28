import { Grid } from './grid';
import { GridGenerator } from './grid-generator';
import { GridRenderer } from './grid-renderer';

function main() {
	const width = 9;
	const height = 9;
	const sectionCount = 9;

	const renderer = new GridRenderer();

	const grid = new Grid(width, height, sectionCount);
	const generator = new GridGenerator();
	const generated = generator.generate(grid);
	renderer.render(generated, document.body);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main);
} else {
	main();
}
