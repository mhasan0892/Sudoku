import * as chai from "chai";
import chaiHttp = require("chai-http");
import { SudokuGenerator } from "../src/controller/entity/SudokuGenerator";

import "mocha";
import {BOARD_SIZE, BOX_SIZE, SudokuHelper} from "../src/controller/helper/sudoku.helper";

chai.use(chaiHttp);
const assert = chai.assert;

describe("Random Sudoku Board Generator Unit Tests", () => {
    let sudokuGenerator: SudokuGenerator;
    let sudokuHelper: SudokuHelper;

    beforeEach(() => {
        sudokuGenerator = new SudokuGenerator();
    });

    it("should return a random board with cell containing numbers between 1 and 9", () => {
        let board: number[][] = sudokuGenerator.getRandomSudokuBoard();
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                let cellValue = board[r][c];
                assert(cellValue >= 1 && cellValue <= 9);
            }
        }
    });

    it("should populate top-left to bottom-right diagonal boxes only", () => {
        sudokuGenerator.populateDiagonalBoxes();
        sudokuHelper = new SudokuHelper(sudokuGenerator.board);
        for (let i = 0; i < BOARD_SIZE; i += BOX_SIZE) {
            for (let n = 1; n <= 9; n++) {
                assert(sudokuHelper.isUsedInTheBox({row: i, col: i}, n));
            }
        }
    });

    it("should populate all empty cells with numbers between 1 and 9",() => {
        sudokuGenerator.populateEmptyCells({row: 0, col: 0});
        sudokuHelper = new SudokuHelper(sudokuGenerator.board);
        let count: number[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            count[i] = 0;
        }
        for (let i = 0; i < BOARD_SIZE; i += BOX_SIZE) {
            for (let n = 1; n <= 9; n++) {
                assert(!sudokuHelper.isUsedInTheBox({row: i, col: i}, n));
            }
        }
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if ((Math.floor(i / BOX_SIZE) * BOX_SIZE == Math.floor(j / BOX_SIZE) * BOX_SIZE))
                    continue;
                let cellValue = sudokuGenerator.board[i][j];
                assert(cellValue >= 1 && cellValue <= 9);
            }
        }
    });

    it('should return an empty board', () => {
        let board: number[][] = sudokuGenerator.getEmptyBoard();
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                assert(board[i][j] == 0)
            }
        }
    });
});
