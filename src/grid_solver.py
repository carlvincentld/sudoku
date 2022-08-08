from random import shuffle

class GridSolver:
    def __init__(self, grid):
        self.grid = grid.copy()

    def solve(self):
        cells = list(self.grid.cells)
        #shuffle(cells)
        return self._inner_solve(cells, 0)

    def _inner_solve(self, cells, index):
        if index == len(cells):
            return True

        cell = cells[index]
        if cell.value != 0:
            return self._inner_solve(cells, index + 1)

        for value in cell.available_values():
            cell.set_value(value)
            if self._inner_solve(cells, index + 1):
                return True
            cell.unset_value()

        return False

    """
    Counts the amount of solution, stopping after 2
    """
    def count_solutions(self):
        cells = list(self.grid.cells)
        return self._count_solutions(cells, 0)

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
