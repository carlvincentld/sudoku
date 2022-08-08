from grid_solver import GridSolver
from random import shuffle

class GridGenerator:
    def __init__(self, grid):
        self.grid = grid.copy()

    def try_generate(self):
        self._solve()

        solver = GridSolver(self.grid)
        cells = list(self.grid.cells)
        shuffle(cells)
        for cell in cells:
            value = cell.unset_value()
            if self._count_solutions(self.grid.cells, 0) != 1:
                cell.set_value(value)
        return self.grid.copy()

    def _solve(self):
        cells = list(self.grid.cells)
        self._inner_solve(cells, 0)

    def _inner_solve(self, cells, index):
        if index == len(cells):
            return True

        cell = cells[index]
        if cell.value != 0:
            return self._inner_solve(cells, index + 1)

        values = list(cell.available_values())
        shuffle(values)
        for value in values:
            cell.set_value(value)
            if self._inner_solve(cells, index + 1):
                return True
            cell.unset_value()

        return False

    """
    Counts the amount of solution, stopping after 2
    """
    def _count_solutions(self, cells, index):
        if index == len(cells):
            return 1

        cell = cells[index]
        if cell.value != 0:
            return self._count_solutions(cells, index + 1)

        count = 0
        for value in cell.available_values():
            cell.set_value(value)
            count += self._count_solutions(cells, index + 1)
            cell.unset_value()

            # CAVEAT: Short-circuiting to keep performances at bay
            if count > 1:
                return count

        return count
