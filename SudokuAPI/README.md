# SudokuAPI

This API provides a randomly generated Sudoku board. The API handles both http `GET` and `POST` requests.

`END_POINT` - `/sudoku/board` \
`GET` - Gets a random board. \
`POST` - Receives a request with preselected values and responds with a solved Sudoku board.  

## Development server

Make sure to run `npm install` in the root directory (SudokuClient) to install all dependencies. Run `npm run start` for a dev server. Navigate to `http://localhost:3000/sudoku/board`. Should be a JSON object containing a randomly generated board. The build automatically runs all the tests before starting the server.
