# SudokuClient

This project was built with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.1. The Sudoku Client provides an UI to display a Sudoku board. The board displays an 9X9 grid, each cell containing a number. Initially the client shows a randomly generated Sudoku board. There is a reload button that when pressed the board should get refreshed with a new random board. Each cell is selectable. Selecting a few cells and pressing reload will generate a new board keeping the selected items. The UI shows a nice rotating gear from [loading.io](https://loading.io)  

## Development server

Make sure to run `npm install` in the root directory (SudokuClient) to install all dependencies. Run `npm run start` for a dev server. Navigate to `http://localhost:8080/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

