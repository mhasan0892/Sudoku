export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;

/**
 * Interface to store coordinates of a cell
 */
export interface Cell {
    row: number;
    col: number;
}

/**
 * Sudoku Helper class to help with sudoku number generation and validation
 */
export class SudokuHelper {
    readonly board: number[][];

    constructor(board: number[][]) {
        this.board = board;
    }

    /**
     * Returns a random number between 1 and the specified range
     * @param range
     */
    getRandomNumber(range: number): number {
        return Math.floor(Math.random() * range) + 1;
    }

    isUsedInTheBox(boxStart: Cell, n: number): boolean
    {
        for (let i = 0; i < BOX_SIZE; i++) {
            for (let j = 0; j < BOX_SIZE; j++) {
                if (this.board[boxStart.row + i][boxStart.col + j] == n) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * check the number is used within the specified row
     * @param r index of the row
     * @param n number to check
     */
    private existsInRow(r: number, n: number): boolean {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (this.board[r][c] == n) {
                return true;
            }
        }
        return false;
    }

    /**
     * check the number is used within the specified column
     * @param c index of the column
     * @param n number to check
     */
    private existsInColumn(c: number, n: number): boolean {
        for (let r = 0; r < BOARD_SIZE; r++) {
            if (this.board[r][c] == n) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determines if a number is a valid candidate for the specified cell
     * @param cell the cell which we are trying to populate
     * @param n the number that we want to put within the cell
     */
    isValidCandidate(cell: Cell, n: number): boolean {
        return !(this.existsInRow(cell.row, n)
            || this.existsInColumn(cell.col, n)
            || this.isUsedInTheBox({
                row: cell.row - (cell.row % BOX_SIZE),
                col: cell.col - (cell.col % BOX_SIZE)
            }, n));
    }
}