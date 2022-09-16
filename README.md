# Sudoku

A vanilla TypeScript implementation of a Sudoku grid, including a generator for a classical 9x9 grid.

Features includes:
- Classical & jigsaw grid generator;
- 9x9 grid generation;
- Pencil markings;
- Grid validation;
- Undo & redo;
- Shortcuts (grid or controls must be focussed);

Planned features:
- Better controls (fill every markings);
- Dynamic font-size;
- Injecting a random seed;
- Highlighting numbers corresponding to the current control;
- Variable size grid;
- Generating grids by difficulty;

# Installation

```bash
npm install
```

No additionnal steps are required.

# Usage

The solution uses Typescript modules, thus requiring a server for CORS.
By default, the server will be available at http://127.0.0.1:8080/

```bash
# For usage
npm run start

# For development purposes
npm run dev
```
