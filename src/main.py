from grid import Grid
from grid_solver import GridSolver
from grid_generator import GridGenerator

generator = GridGenerator(Grid(9, 9, 9))
generator.try_generate()
generator.solver.grid.pprint()
