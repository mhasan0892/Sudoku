import { Request, Response } from "express";
import { SudokuGenerator } from "./entity/SudokuGenerator";
import {SudokuSolver} from "./entity/SudokuSolver";

/**
 * handles the get request to generate a random sudoku board
 * @param req
 * @param res randomly generated sudoku board
 */
export let getRandomBoard = (req: Request, res: Response) => {
    let sudokuGenerator = new SudokuGenerator();
    res.json(sudokuGenerator.getRandomSudokuBoard());
};

/**
 * handles the post request to solve a sudoku board with pre-selected values
 * @param req contains the sudoku board selected initial values
 * @param res randomly generated board with selected values in place
 */
export let getSolvedBoard = (req: Request, res: Response) => {
    let sudokuSolver = new SudokuSolver(req.body);
    res.json(sudokuSolver.solve());
};