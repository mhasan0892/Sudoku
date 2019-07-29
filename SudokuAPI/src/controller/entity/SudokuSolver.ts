import {BOARD_SIZE, SudokuHelper} from "../helper/sudoku.helper";

/**
 * interface for board iterator
 */
interface BoardIteratorMap {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
    incrementRow: number;
    incrementCol: number;
}

/**
 * interface for easy indexing of the board iterator
 */
interface BoardIterator {
    [index: number]: BoardIteratorMap
}

/**
 * List of items in the board iterator
 */
const boardIteratorList: BoardIterator = [
    {
        startRow: 0,
        endRow: 8,
        startCol: 0,
        endCol: 8,
        incrementRow: 1,
        incrementCol: 1
    },
    {
        startRow: 0,
        endRow: 8,
        startCol: 8,
        endCol: 0,
        incrementRow: 1,
        incrementCol: -1
    },
    {
        startRow: 8,
        endRow: 0,
        startCol: 0,
        endCol: 8,
        incrementRow: -1,
        incrementCol: 1
    },
    {
        startRow: 8,
        endRow: 0,
        startCol: 8,
        endCol: 0,
        incrementRow: -1,
        incrementCol: -1
    }
];

/**
 * This class tries to solve a sudoku board with pre-selected values.
 * The board is initialized with some cells with values between 1 and 9
 * and for the rest of them are 0. To add some randomization the board
 * will randomly pick one of the following iterator
 * - left to right and top to bottom
 * - right to left and top to bottom
 * - left to right and bottom to top
 * - right to left and bottom to top
 */
export class SudokuSolver {

    private board: number[][];
    private helper: SudokuHelper;
    private randomSide: BoardIteratorMap;

    /**
     * constructor with an initial board to start solving the sudoku.
     * Initializes the helper class and a random side.
     * @param board initial board with only selected cells with values and other cells with 0.
     */
    constructor(board: number[][]) {
        this.board = board;
        this.helper = new SudokuHelper(this.board);
        this.randomSide = this.getRandomSide(this.helper.getRandomNumber(4));
    }

    /**
     * checks if the index is in bounds
     * @param index
     */
    private isInBounds(index: number) :boolean {
        return index >= 0 && index < BOARD_SIZE;
    }

    /**
     * method to solve the board recursively
     * @returns true/false based on the last attempt
     */
    private solvePresetBoard(): boolean {
        for (let row = this.randomSide.startRow; this.isInBounds(row); row += this.randomSide.incrementRow) {
            for (let col = this.randomSide.startCol; this.isInBounds(col); col += this.randomSide.incrementCol) {
                if (this.board[row][col] == 0) {
                    for (let k = 1; k <= 9; k++) {
                        // if k is a valid candidate to put number k then try to solve the board recursively
                        if (this.helper.isValidCandidate({row: row, col: col}, k)) {
                            this.board[row][col] = k;
                            if (this.solvePresetBoard()) {
                                return true;
                            }
                            else {
                                this.board[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Returns the solved sudoku board
     * @returns solved 9x9 board
     */
    solve(): number[][] {
        if (this.solvePresetBoard()) return this.board;
    }

    /**
     * Takes a random number and returns the associated board iterator
     * @param side
     */
    private getRandomSide(side: number): BoardIteratorMap {
        return boardIteratorList[side-1];
    }

}