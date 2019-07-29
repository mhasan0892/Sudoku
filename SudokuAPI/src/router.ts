import express = require("express");
var parser = require("body-parser");

//Controllers
import * as sudokuController from "./controller/board.controller";

// Our Express APP config
const router = express();
router.use(parser.json({extended : true}));
router.set("port", process.env.PORT || 3000);

// API Endpoints
router.get("/sudoku/board", sudokuController.getRandomBoard);
router.post("/sudoku/board", sudokuController.getSolvedBoard);


// export our router
export default router;