import { Grid } from './grid';
import { GridGenerator } from './grid-generator';

document.addEventListener('DOMContentLoaded', () => {
	const width = 9;
	const height = 9;
	const sectionCount = 9;

	const grid = new Grid(width, height, sectionCount);
	const generator = new GridGenerator();
	const generated = generator.generate(grid);
	generated.render(document.body);
});
