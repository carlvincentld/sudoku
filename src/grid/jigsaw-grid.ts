import { groupBySet, shuffle, unique } from "../helpers/array.helper";
import { equivalent } from "../helpers/set.helper";
import { Cell } from "./cell";
import { CellCollection } from "./cell-collection";
import { CellsByPosition, Grid } from "./grid";

const ITERATION_COUNT = 1000;

type Section = CellCollection;
type CellsBySection = Map<Section, Set<Cell>>;
type Position = `${number},${number}`;

export class JigsawGrid extends Grid {
    constructor(
		WIDTH: number,
		HEIGHT: number,
		SECTION_COUNT: number
    ){
        super(WIDTH, HEIGHT, SECTION_COUNT);
        this.shuffleSections();
    }

    private shuffleSections() {
        const cellsBySection = groupBySet(this.cells, (x) => x.section);
        const cellsByPosition = this.cellsByPosition;

        for (let i = 0; i < ITERATION_COUNT; i++) {
            if(!this.swap2(cellsBySection, cellsByPosition)) {
                throw new Error(`Was not able to swap sections`);
            }
        }
    }

    private swap2(cellsBySection: CellsBySection, cellsByPosition: CellsByPosition) {
        const sections = shuffle(cellsBySection.keys());
        for (const sourceSection of sections) {
            for (const sourceCell of cellsBySection.get(sourceSection)!) {
                const neighbouringSections = unique(
                    this.neighbouringCells(sourceCell, cellsByPosition)
                        .map(x => x.section)
                        .filter(x => x !== sourceSection));

                // Has no neighbours in the other section
                if (neighbouringSections.length === 0) {
                    continue;
                }

                for (const targetCell of shuffle(neighbouringSections.flatMap(x => Array.from(cellsBySection.get(x)!)))) {
                    // Has no swappable neighbours in sourceSection
                    if (!this.neighbouringCells(targetCell, cellsByPosition)
                        .some(x => x.section === sourceSection && x !== sourceCell)) {
                        continue;
                    }

                    this.swapSections(sourceCell, targetCell, cellsBySection);

                    if (
                        this.isSectionContiguous(sourceCell.section, cellsBySection, cellsByPosition)
                        && this.isSectionContiguous(targetCell.section, cellsBySection, cellsByPosition)
                    ) {
                        return true;
                    }

                    this.swapSections(sourceCell, targetCell, cellsBySection);
                }
            }
        }

        return false;
    }

    private neighbouringCells(cell: Cell, cellsByPosition: CellsByPosition): Cell[] {
        const neighboursPosition: Array<Position> = [
            cell.position(-1, 0),
            cell.position(+1, 0),
            cell.position(0, -1),
            cell.position(0, +1),
        ];

        return neighboursPosition
            .reduce(
                (acc, x) => {
                    const neighbour = cellsByPosition.get(x);
                    if (neighbour !== undefined) {
                        acc.push(neighbour);
                    }
                    return acc;
                },
                new Array<Cell>());
    }

    private isSectionContiguous(
        section: Section, 
        cellsBySection: CellsBySection, 
        cellsByPosition: CellsByPosition
    ): boolean {
        const cells = cellsBySection.get(section)!;
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
                ...this.neighbouringCells(cell, cellsByPosition)
                    .filter(x => x.section === section));
        }

        return equivalent(visited, cells);
    }

    private swapSections(a: Cell, b: Cell, cellsBySection: CellsBySection): void {
        cellsBySection.get(a.section)!.delete(a);
        cellsBySection.get(b.section)!.delete(b);

        const tmp = a.section;
        a.section = b.section;
        b.section = tmp;

        cellsBySection.get(a.section)!.add(a);
        cellsBySection.get(b.section)!.add(b);
    }
}