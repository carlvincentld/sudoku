from pprint import pprint
from cell import Cell
from cell_collection import CellCollection

class Grid:
    def __init__(self, width, height, section_count):
        if any(x != 9 for x in [width, height, section_count]):
            raise "Only 9x9 grids of 9 sections are supported"

        self.width = width
        self.height = height
        self.section_count = section_count

        value_count = width * height // section_count
        self.columns = [ CellCollection(value_count) for _ in range(width) ]
        self.rows = [ CellCollection(value_count) for _ in range(height) ]
        self.sections = [ CellCollection(value_count) for _ in range(section_count) ]

        self.cells = [
                Cell(
                    x,
                    y,
                    self.columns[x],
                    self.rows[y],
                    self.sections[x // 3 + 3 * (y // 3)])
                for x in range(width)
                for y in range(height) ]

    def pprint(self):
        grid = [ [ 0 for x in range(self.width) ] for y in range(self.height) ]
        for cell in self.cells:
            grid[cell.y][cell.x] = cell.value
        pprint(grid)

    """
    Creates a real deep clone of the given grid
    """
    def copy(self):
        other = Grid(self.width, self.height, self.section_count)
        curr_cells = sorted(self.cells, key=lambda x: (x.x, x.y))
        cells = sorted(other.cells, key=lambda x: (x.x, x.y))
        for current, successor in zip(curr_cells, cells):
            if current.value == 0:
                continue
            successor.set_value(current.value)
        return other

