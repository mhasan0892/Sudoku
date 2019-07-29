import {async, getTestBed, TestBed} from '@angular/core/testing';

import { SudokuService } from './sudoku.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';


function getEmptyBoard(isRandom: boolean): number[][] {
  let emptyBoard: any = [];
  for (let i = 0; i < 9; i++) {
    emptyBoard[i] = [];
    for (let j = 0; j < 9; j++) {
      emptyBoard[i][j] = isRandom ? Math.random() * 9 + 1 : 0;
    }
  }
  return emptyBoard;
}

describe('Testing SudokuService', () => {
  let injector: TestBed;
  let service: SudokuService;
  let httpMock: HttpTestingController;
  let dummyBoard: number[][];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SudokuService]
    }).compileComponents().then(() => {
      injector = getTestBed();
      service = injector.get(SudokuService);
      httpMock = injector.get(HttpTestingController);
      dummyBoard = getEmptyBoard(false);
    });
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const serviceTest: SudokuService = TestBed.get(SudokuService);
    expect(serviceTest).toBeTruthy();
  });

  it('should get Random Sudoku board', () => {
    service.getRandomSudokuBoard().subscribe(data => {
      expect(data.length).toEqual(9);
      expect(data[0].length).toEqual(9);
      expect(data).toEqual(dummyBoard);
    });

    const req = httpMock.expectOne(service.END_POINT);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBoard);
  });

  it('should call sudoku solver for selected board', () => {
    service.solveSelectedSudokuBoard(dummyBoard).subscribe(data => {
      expect(data.length).toEqual(9);
      expect(data[0].length).toEqual(9);
      expect(data).not.toEqual(dummyBoard);
    });

    const req = httpMock.expectOne(service.END_POINT);
    expect(req.request.method).toBe('POST');
    req.flush(getEmptyBoard(true));
  });

});
