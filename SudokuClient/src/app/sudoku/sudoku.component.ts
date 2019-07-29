import { Component, OnInit } from '@angular/core';
import { SudokuService } from '../sudoku.service';
import {throwError} from 'rxjs';

export const BOARD_SIZE = 9;

@Component({
  selector: 'app-sudoku',
  providers: [SudokuService],
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})

/**
 * Sudoku component class contain the functionality to render a sudoku board
 */
export class SudokuComponent implements OnInit {
  board: any = [];
  selected: boolean[][];
  private loading = true;
  sudokuService: SudokuService = null;

  constructor(sudokuService: SudokuService) {
    this.sudokuService = sudokuService;
  }

  /**
   * On init generates a random sudoku board
   */
  ngOnInit() {
    this.getRandomBoard();
  }

  /**
   * Initializes the board to contain no selected cell
   */
  private initSelection() {
    this.selected = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.selected[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.selected[i][j] = false;
      }
    }
  }

  /**
   * Resets the board to 0 for unselected cells and
   * returns whether any of the cells were selected
   * @returns boolean to indicate if any cells were selected
   */
  private resetAndIsNoneSelected(): boolean {
    this.loading = true;
    let noneSelected = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!this.selected[i][j]) {
          this.board[i][j] = 0;
        } else {
          noneSelected = false;
        }
      }
    }
    return noneSelected;
  }

  /**
   * Event handler for the reload button to refresh the sudoku board
   * with pre-selected values. Uses the @SudokuService to get the board
   */
  reload() {
    if (!this.resetAndIsNoneSelected()) {
      this.sudokuService.solveSelectedSudokuBoard(this.board).subscribe(
        (data: {}) => this.processBoard(data),
        error => console.error('error reseting the board' + error));
    } else  {
      this.getRandomBoard();
    }
  }

  /**
   * Gets a random board using sudoku service and processes the board
   */
  getRandomBoard() {
    this.sudokuService.getRandomSudokuBoard().subscribe(
      (data: {}) => this.processBoard(data),
      error => throwError('error resetting the board')
      );
  }

  /**
   * processes a given board for rendering
   * @param data board data
   */
  public processBoard(data: {}) {
    this.loading = false;
    this.board = data;
    this.initSelection();
  }

  /**
   * Click event handler for a cell at (r,c) that flips the rendering status of cell
   * @param r row index of the cell
   * @param c col index of the cell
   */
  cellClicked(r: number, c: number) {
    this.selected[r][c] = !this.selected[r][c];
  }

  /**
   * returns whether a cell at (r,c) is clicked or not.
   * @param r row index of the cell
   * @param c col index of the cell
   * @returns true if the cell is in selected status
   */
  isSelected(r: number, c: number): boolean {
    return this.selected[r][c];
  }

  /**
   * returns whether the board is awaiting response from sudoku api
   * and renders a spinning gear
   * @returns true if the board is waiting to get response
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * returns the current board
   * @returns current 9x9 board to render
   */
  getCurrentBoard(): number[][] {
    return this.board;
  }
}


