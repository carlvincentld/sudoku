import { Cell } from './cell';
import { CellCollection } from './cell-collection';
import { range } from './helpers/array.helper';
export class Grid {
    constructor(_width, _height, _sectionCount) {
        this._width = _width;
        this._height = _height;
        this._sectionCount = _sectionCount;
        if (this._width !== 9
            || this._height !== 9
            || this._sectionCount !== 9) {
            throw new Error('Only 9x9 gris of 9 sections are supported');
        }
        const valueCount = this._width * this._height / this._sectionCount;
        this._columns = range(this._width).map(x => new CellCollection(valueCount));
        this._rows = range(this._height).map(x => new CellCollection(valueCount));
        this._sections = range(this._sectionCount).map(x => new CellCollection(valueCount));
        this.cells = range(this._width)
            .flatMap(x => range(this._height).map(y => {
            return new Cell(x, y, this._columns[x], this._rows[y], this._sections[Math.floor(x / 3)
                + 3 * Math.floor(y / 3)]);
        }));
    }
    clone() {
        const result = new Grid(this._width, this._height, this._sectionCount);
        const ordering = (a, b) => {
            if (a.x < b.x) {
                return -1;
            }
            else if (a.x > b.x) {
                return 1;
            }
            else if (a.y < b.y) {
                return -1;
            }
            else if (a.y > b.y) {
                return -1;
            }
            return 0;
        };
        result.cells.sort(ordering);
        const cells = Array.from(this.cells).sort(ordering);
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.value === 0) {
                continue;
            }
            result.cells[i].setValue(cell.value);
        }
        return result;
    }
    render(parent) {
        const cells = new Map(this.cells.map(c => [`${c.y},${c.x}`, c]));
        const table = document.createElement('table');
        for (let y = 0; y < this._height; y++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let x = 0; x < this._width; x++) {
                const td = document.createElement('td');
                tr.appendChild(td);
                const cell = cells.get(`${y},${x}`);
                if (cell === null || cell === undefined || cell.value === 0) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    td.appendChild(input);
                }
                else {
                    const span = document.createElement('span');
                    span.classList.add('constant');
                    span.textContent = `${cell.value}`;
                    span.appendChild(span);
                }
            }
        }
        parent.appendChild(table);
    }
}
