import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

/**
 * Sudoku Service class that makes Http get/post request to get a sudoku board.
 */
export class SudokuService {

  readonly END_POINT = '/sudoku/board';

  constructor(private http: HttpClient) { }

  /**
   * Makes a GET request to get a random sudoku board from the end point
   */
  getRandomSudokuBoard(): Observable<any> {
    return this.http.get(this.END_POINT).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Makes a POST request to solve a sudoku board with pre-selected values
   * @param board the sudoku board with pre-selected values
   */
  solveSelectedSudokuBoard(board: number[][]): Observable<any> {
    return this.http.post(this.END_POINT, board).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Handles any errors and shows an alert dialog
   */
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
