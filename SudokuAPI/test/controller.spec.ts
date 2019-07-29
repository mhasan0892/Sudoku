import router from "../src/router";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import "mocha";
import * as assert from "assert";
import {SudokuGenerator} from "../src/controller/entity/SudokuGenerator";
import {BOARD_SIZE, BOX_SIZE, SudokuHelper} from "../src/controller/helper/sudoku.helper";

chai.use(chaiHttp);
const expect = chai.expect;

function isUsedExactlyOnceInTheBox(sRow: number, sCol: number, n: number, board: number[][]): boolean
{
    let count: number = 0;
    for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
            if (board[sRow + i][sCol + j] == n) {
                count++;
            }
        }
    }
    return count == 1;
}

// check in the row for existence
function existsExactlyOnceInRow(r: number, n: number, board: number[][]): boolean {
    let count: number = 0;
    for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] == n) {
            count++;
        }
    }
    return count == 1;
}

// check in the column for existence
function existsExactlyOnceInColumn(c: number, n: number, board: number[][]): boolean {
    let count: number = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        if (board[r][c] == n) {
            count++;
        }
    }
    return count == 1;
}

export function validateElement(r: number,c: number, n: number, board: number[][]): boolean {
    return (existsExactlyOnceInRow(r, n, board)
        && existsExactlyOnceInColumn(c, n, board)
        && isUsedExactlyOnceInTheBox(r - (r % BOX_SIZE), c - (c % BOX_SIZE), n, board));
}

describe("Sudoku board API Request", () => {

    it("should return a valid 9x9 random board", async () => {
        return chai
            .request(router)
            .get("/sudoku/board")
            .then(res => {
                let board: number[][] = res.body;
                expect({row: board.length, col: board[0].length}).to.eql({row: 9, col: 9});
                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        for (let n = 1; n <= 9; n++) {
                            assert(validateElement(i, j, n, board));
                        }
                    }
                }
            });
    });

    it("should return a valid 9X9 board with preset values", async () => {
        let sudokuGenerator: SudokuGenerator = new SudokuGenerator();
        let randomBoard: number[][] = sudokuGenerator.getRandomSudokuBoard();
        new SudokuHelper(randomBoard);
        let numberToCheck: number = randomBoard[0][0];
        let emptyBoard: number[][] = sudokuGenerator.getEmptyBoard();
        emptyBoard[0][0] = numberToCheck;
        return chai
            .request(router)
            .post("/sudoku/board")
            .send(emptyBoard)
            .then(res => {
                let board: number[][] = res.body;
                expect({row: board.length, col: board[0].length}).to.eql({row: 9, col: 9});
                expect(board[0][0]).to.eql(numberToCheck);

                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        for (let n = 1; n <= 9; n++) {
                            assert(validateElement(i, j, n, board));
                        }
                    }
                }
            });
    });
});