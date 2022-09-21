const SVG_NS = 'http://www.w3.org/2000/svg';

const VIEWPORT_WIDTH = 9;
const VIEWPORT_HEIGHT = 9;

export class SVGGenerator {
	createSVG(): SVGSVGElement {
		const svg = document.createElementNS(SVG_NS, 'svg');
		svg.setAttribute('viewBox', `0 0 ${VIEWPORT_WIDTH} ${VIEWPORT_WIDTH}`);
		svg.setAttribute('width', '100%');
		svg.setAttribute('height', '100%');

		return svg;
	}

	createPencilMarking(
		value: number,
		maxX: number,
		maxY: number
	): SVGTextElement {
		const x = (value - 1) % maxX;
		const y = Math.floor((value - 1) / maxX);

		const offsetX = (VIEWPORT_WIDTH / maxX) * (x + 0.5);
		const offsetY = (VIEWPORT_WIDTH / maxY) * (y + 0.5);

		const text = document.createElementNS(SVG_NS, 'text');
		text.classList.add('pencil-marking');
		text.setAttribute('font-size', '3');
		text.setAttribute('font-family', 'monospace');
		text.setAttribute('font-style', 'italic');
		text.setAttribute('font-weight', 'bold');
		text.setAttribute('fill', 'currentColor');
		text.setAttribute('text-anchor', 'middle');
		text.setAttribute('dominant-baseline', 'central');
		text.setAttribute('x', `${offsetX}`);
		text.setAttribute('y', `${offsetY}`);
		text.textContent = `${value}`;

		return text;
	}

	createPenMarking(value: number, immutable: boolean = false): SVGTextElement {
		const text = this.createCustomText(`${value}`);
		text.classList.add('pen-marking');
		if (immutable) {
			text.setAttribute('font-weight', 'bold');
		} else {
			text.setAttribute('font-style', 'italic');
			text.setAttribute('font-weight', 'normal');
		}

		return text;
	}

	createCustomText(value: string): SVGTextElement {
		const text = document.createElementNS(SVG_NS, 'text');
		text.setAttribute('font-size', '5');
		text.setAttribute('font-family', 'monospace');
		text.setAttribute('font-weight', 'bold');
		text.setAttribute('fill', 'currentColor');
		text.setAttribute('text-anchor', 'middle');
		text.setAttribute('dominant-baseline', 'central');
		text.setAttribute('x', `${VIEWPORT_WIDTH / 2}`);
		text.setAttribute('y', `${VIEWPORT_HEIGHT / 2}`);
		text.innerHTML = value;

		return text;
	}
}
