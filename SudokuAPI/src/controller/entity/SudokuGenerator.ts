import {BOARD_SIZE, BOX_SIZE, Cell, SudokuHelper} from "../helper/sudoku.helper";

/**
* Random Sudoku Generator class for boards with no selection
*/
export class SudokuGenerator {
    board: number[][];
    helper: SudokuHelper;

    /**
     * Constructor to initialize with an empty board and the helper object
     */
    constructor() {
        this.board = this.getEmptyBoard();
        this.helper = new SudokuHelper(this.board);
    }

    /**
     * Random board generator
     * @returns a randomly generated 9x9 matrix with random numbers (following sudoku rules)
     */
    getRandomSudokuBoard(): number[][] {
        this.populateDiagonalBoxes();
        this.populateEmptyCells({row: 0, col: BOX_SIZE});
        return this.board;
    }

    /**
     * Populates top-left to bottom-right diagonal boxes
     */
    populateDiagonalBoxes() {
        for (let i = 0; i < BOARD_SIZE; i = i + BOX_SIZE) {
            this.populateBox({row: i, col: i});
        }
    }

    /**
     * Generates a random number between 1 and 9(inclusive) and updates the cell
     * if its valid for the 3x3 box
     * @param boxStart cell where the box starts
     */
    private populateBox(boxStart: Cell) {
        let randomNum: number;
        for (let i = 0; i < BOX_SIZE; i++) {
            for (let j = 0; j < BOX_SIZE; j++) {
                do {
                    randomNum = this.helper.getRandomNumber(BOARD_SIZE);
                }
                while (this.helper.isUsedInTheBox(boxStart, randomNum));

                this.board[boxStart.row + i][boxStart.col + j] = randomNum;
            }
        }
    }

    /**
     * Populates the cell that are still empty after populating the diagonal boxes
     * @param cell
     */
    populateEmptyCells(cell: Cell): boolean {
        if (cell.col >= BOARD_SIZE && cell.row < BOARD_SIZE-1) {
            cell.row++;
            cell.col = 0;
        }
        if (this.isComplete(cell))
            return true;

        cell = this.getNextCell(cell);
        if (cell.row >= BOARD_SIZE)
            return true;

        for (let num = 1; num <= BOARD_SIZE; num++) {
            if (this.helper.isValidCandidate(cell, num)) {
                this.board[cell.row][cell.col] = num;
                if (this.populateEmptyCells({row: cell.row, col: cell.col + 1}))
                    return true;

                this.board[cell.row][cell.col] = 0;
            }
        }
        return false;
    }

    /**
     * Determines if the Sudoku board generation is complete
     * by determining if the cell is out of bounds (both row and column)
     * @param cell
     */
    private isComplete(cell: Cell): boolean {
        return cell.row >= BOARD_SIZE && cell.col >= BOARD_SIZE;
    }


    /**
     * Gets the next candidate cell to compute a valid sudoku number
     * @param cell
     * @returns the next candidate cell
     */
    private getNextCell(cell: Cell): Cell {
        let nextCell: Cell = cell;
        if (cell.row < BOX_SIZE) {
            if (cell.col < BOX_SIZE)
                nextCell.col = BOX_SIZE;
        } else if (cell.row < BOARD_SIZE-BOX_SIZE) {
            if (cell.col == Math.floor(cell.row/BOX_SIZE) * BOX_SIZE)
                nextCell.col = cell.col + BOX_SIZE;
        } else {
            if (cell.col == BOARD_SIZE-BOX_SIZE) {
                nextCell.row = cell.row + 1;
                nextCell.col = 0;
            }
        }
        return nextCell;
    }

    /**
     * Gets an empty board for random sudoku number generation
     * @returns an empty board
     */
    getEmptyBoard(): number[][] {
        let emptyBoard: any=[];
        for (let i = 0; i < BOARD_SIZE; i++) {
            emptyBoard[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                emptyBoard[i][j] = 0;
            }
        }
        return emptyBoard;
    }
}