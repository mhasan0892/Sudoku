import * as chai from "chai";
import chaiHttp = require("chai-http");

import "mocha";
import {BOARD_SIZE, BOX_SIZE, SudokuHelper} from "../src/controller/helper/sudoku.helper";
import {SudokuGenerator} from "../src/controller/entity/SudokuGenerator";

chai.use(chaiHttp);
const assert = chai.assert;

describe("Sudoku Helper Unit Tests", () => {
    let sudokuHelper: SudokuHelper;
    let sudokuGenerator: SudokuGenerator;
    let emptyBoard: number[][];
    const validBoard: number[][] = [ [ 3, 9, 8, 7, 6, 5, 4, 2, 1 ],
        [ 7, 4, 2, 9, 8, 1, 6, 5, 3 ],
        [ 6, 5, 1, 4, 3, 2, 9, 8, 7 ],
        [ 9, 8, 7, 6, 5, 4, 3, 1, 2 ],
        [ 2, 1, 3, 8, 9, 7, 5, 6, 4 ],
        [ 5, 6, 4, 2, 1, 3, 7, 9, 8 ],
        [ 8, 7, 9, 1, 4, 6, 2, 3, 5 ],
        [ 1, 2, 5, 3, 7, 9, 8, 4, 6 ],
        [ 4, 3, 6, 5, 2, 8, 1, 7, 9 ] ];

    beforeEach(() => {
        sudokuGenerator = new SudokuGenerator();
        sudokuHelper = new SudokuHelper(validBoard);
        emptyBoard = sudokuGenerator.getEmptyBoard();
    });

    it('should generate random number between 1 and 9', () => {
        let randomNumber: number = sudokuHelper.getRandomNumber(9);
        assert(randomNumber >= 1 && randomNumber <= 9);
    });

    it('All numbers between 1 and 9 should be in all diagonal boxes', () => {
        for (let n = 1; n <= 9; n++) {
            for (let i = 0; i < BOARD_SIZE; i = i + BOX_SIZE) {
                assert(sudokuHelper.isUsedInTheBox({row: i, col: i}, n));
            }
        }
    });

    it('should be able to validate a valid sudoku board', () => {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let n = 1; n <= 9; n++) {
                    assert(!sudokuHelper.isValidCandidate({row: i, col: j}, n));
                }
            }
        }
    });

    it('should be able to find whether a board is invalid', () => {
        let helperWithInvalidBoard: SudokuHelper = new SudokuHelper(emptyBoard);

        // invalidating col 0 and validate
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let n = 1; n <= 9; n++) {
                assert(helperWithInvalidBoard.isValidCandidate({row: i, col: 0}, n));
                emptyBoard[i][0] = n;
                assert(!helperWithInvalidBoard.isValidCandidate({row: i, col: 0}, n));
                emptyBoard[i][0] = 0;
            }
        }

        // invalidating row 0 and validate
        for (let j = 0; j < BOARD_SIZE; j++) {
            for (let n = 1; n <= 9; n++) {
                assert(helperWithInvalidBoard.isValidCandidate({row: 0, col: j}, n));
                emptyBoard[0][j] = n;
                assert(!helperWithInvalidBoard.isValidCandidate({row: 0, col: j}, n));
                emptyBoard[0][j] = 0;
            }
        }
    });
});