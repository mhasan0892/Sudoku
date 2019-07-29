import * as chai from "chai";
import chaiHttp = require("chai-http");
import {SudokuSolver} from "../src/controller/entity/SudokuSolver";

import "mocha";
import {BOARD_SIZE, SudokuHelper} from "../src/controller/helper/sudoku.helper";
import {SudokuGenerator} from "../src/controller/entity/SudokuGenerator";
import {validateElement} from "./controller.spec";

chai.use(chaiHttp);

const assert = chai.assert;

describe("Random Sudoku Solver Unit Tests", () => {
    let sudokuSolver: SudokuSolver;
    let sudokuHelper: SudokuHelper;
    let sudokuGenerator: SudokuGenerator;
    let board: number[][];

    beforeEach(() => {
        sudokuGenerator = new SudokuGenerator();
        board = sudokuGenerator.getEmptyBoard();
    });

    it('should solve Sudoku with random preset values', () => {
        sudokuSolver = new SudokuSolver(board);
        sudokuHelper = new SudokuHelper(board);
        const random: number = sudokuHelper.getRandomNumber(BOARD_SIZE-1);
        board[0][0] = random;

        board = sudokuSolver.solve();
        assert(board[0][0] == random);
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let n = 1; n <= 9; n++) {
                    assert(validateElement(i, j, n, board));
                }
            }
        }
    });
});