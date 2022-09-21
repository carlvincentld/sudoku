import { groupBySet, zip } from "../helpers/array.helper";
import { RandomFunc, shuffle} from "../helpers/random.helper";
import { DefaultMap } from "../helpers/default-map";
import { equivalent } from "../helpers/set.helper";
import { Cell } from "./cell";
import { CellCollection } from "./cell-collection";
import { Grid } from "./grid";

const ITERATION_COUNT = 64;

type Section = CellCollection;
type CellsBySection = ReadonlyMap<Section, Set<Cell>>;
type Position = `${number},${number}`;

export class JigsawGrid extends Grid {

    private readonly _cellsBySection: CellsBySection;

    constructor(
		WIDTH: number,
		HEIGHT: number,
		SECTION_COUNT: number,
        private random: RandomFunc,
        skipShuffle: boolean = false
    ){
        super(WIDTH, HEIGHT, SECTION_COUNT);

        this._cellsBySection = groupBySet(this.cells, (x) => x.section);

        if (!skipShuffle)
            this.shuffleSections();
    }

    override clone(): JigsawGrid {
        const result = new JigsawGrid(this.WIDTH, this.HEIGHT, this.SECTION_COUNT, this.random, true);
        const sectionMapping = new Map(zip(this._sections, result._sections));
		const ordering = (a: Cell, b: Cell) => {
			return a.x !== b.x ? b.x - a.x : b.y - a.y;
		};

		result.cells.sort(ordering);
		const cells = Array.from(this.cells).sort(ordering);
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i]!;
            const other = result.cells[i]!;

            other.section = sectionMapping.get(cell.section)!;
			if (cell.value === null) {
				continue;
			}

			other.setValue(cell.value);
		}

		return result;
    }

    private shuffleSections() {
        for (let i = 0; i < ITERATION_COUNT; i++) {
            if(!this.swap()) {
                throw new Error(`Was not able to swap sections`);
            }
        }
    }

    private swap(): boolean {
        const sections = shuffle(this._sections, this.random);
        for (const section of sections) {
            const cellsByNeighbouringSection = new DefaultMap<Section, Set<Cell>>();
            const neighbouringCells = new Set<Cell>();

            for (const cell of this._cellsBySection.get(section)!) {
                for (const neighbour of this.neighbouringCells(cell)) {
                    if (neighbour.section === section) {
                        continue;
                    }

                    cellsByNeighbouringSection
                        .getOrDefault(neighbour.section, () => new Set<Cell>())
                        .add(cell);
                    neighbouringCells.add(neighbour);
                }
            }

            for (const neighbour of shuffle(neighbouringCells, this.random)) {
                const cellsNextToNeighbour = cellsByNeighbouringSection.get(neighbour.section)!;
                for (const cellNextToNeighbour of shuffle(cellsNextToNeighbour, this.random)) {
                    this.swapSections(neighbour, cellNextToNeighbour);

                    if (
                        this.isSectionContiguous(neighbour.section)
                        && this.isSectionContiguous(cellNextToNeighbour.section)
                    ) {
                        return true;
                    }

                    this.swapSections(neighbour, cellNextToNeighbour);
                }
            }
        }

        return false;
    }

    private neighbouringCells(cell: Cell): Cell[] {
        const neighboursPosition: Array<Position> = [
            cell.position(-1, 0),
            cell.position(+1, 0),
            cell.position(0, -1),
            cell.position(0, +1),
        ];

        return neighboursPosition
            .reduce(
                (acc, x) => {
                    const neighbour = this.cellsByPosition.get(x);
                    if (neighbour !== undefined) {
                        acc.push(neighbour);
                    }
                    return acc;
                },
                new Array<Cell>());
    }

    private isSectionContiguous(
        section: Section
    ): boolean {
        const cells = this._cellsBySection.get(section)!;
        const visited = new Set<Cell>();
        const toVisit = Array.from([cells.values().next().value]);

        while (toVisit.length) {
            const cell = toVisit.pop();
            if (visited.has(cell)) {
                continue;
            } else {
                visited.add(cell);
            }

            toVisit.push(
                ...this.neighbouringCells(cell)
                    .filter(x => x.section === section));
        }

        return equivalent(visited, cells);
    }

    private swapSections(a: Cell, b: Cell): void {
        this._cellsBySection.get(a.section)!.delete(a);
        this._cellsBySection.get(b.section)!.delete(b);

        const tmp = a.section;
        a.section = b.section;
        b.section = tmp;

        this._cellsBySection.get(a.section)!.add(a);
        this._cellsBySection.get(b.section)!.add(b);
    }
}