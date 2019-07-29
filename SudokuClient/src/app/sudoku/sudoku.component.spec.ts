import {async, ComponentFixture, getTestBed, inject, TestBed} from '@angular/core/testing';

import {BOARD_SIZE, SudokuComponent} from './sudoku.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {SudokuService} from '../sudoku.service';
import anything = jasmine.anything;
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';


function getEmptyBoard(): number[][] {
  let emptyBoard: any = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    emptyBoard[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      emptyBoard[i][j] = 0;
    }
  }
  return emptyBoard;
}

describe('SudokuComponent UI Testing', () => {
  let component: SudokuComponent;
  let fixture: ComponentFixture<SudokuComponent>;
  let board: number[][];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuComponent ],
      providers: [HttpClient, HttpHandler, SudokuService]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(SudokuComponent);
      component = fixture.componentInstance;
      board = getEmptyBoard();
    });
  }));

  it('should contain button for reload', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button').textContent).toContain('Reload');
  });

  it('should create the loading icon', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.lds-gear')).toBeTruthy();
  });

  it('reload button click should call the handler', async(() => {

    const compiled = fixture.debugElement.nativeElement;
    spyOn(component, 'reload');
    const button = compiled.querySelector('button');
    button.click();
    expect(component.reload).toHaveBeenCalled();
  }));

  it('should contain 9X9 grid', async(() => {
    spyOn(component, 'reload');
    spyOn(component, 'isLoading').and.returnValue(false);
    spyOn(component, 'isSelected').and.callFake(() => false);
    spyOn(component, 'getCurrentBoard').and.returnValue(board);
    spyOn(component, 'cellClicked').and.callFake((r, c) => false);;
    const compiled = fixture.debugElement;
    const button = compiled.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.isLoading).toHaveBeenCalled();
    expect(component.isSelected).toHaveBeenCalled();
    expect(component.getCurrentBoard).toHaveBeenCalled();
    expect(component.reload).toHaveBeenCalled();
    const rowCount = compiled.query(By.css('.grid-container')).parent.children.length;
    expect(rowCount).toBe(9);
    const colCount = compiled.query(By.css('.grid-item')).parent.children.length;
    expect(colCount).toBe(9);
  }));

  it('Click should highlight correct cell', async(() => {
    spyOn(component, 'reload');
    spyOn(component, 'isLoading').and.returnValue(false);
    const mockIsSelected = spyOn(component, 'isSelected');
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (i == 0 && j == 0) {
          mockIsSelected.withArgs(i, j).and.returnValue(true);
        } else {
          mockIsSelected.withArgs(i, j).and.returnValue(false);
        }
      }
    }
    spyOn(component, 'getCurrentBoard').and.returnValue(board);
    spyOn(component, 'cellClicked').withArgs(anything(), anything());

    const compiled = fixture.debugElement;
    const button = compiled.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.isLoading).toHaveBeenCalled();
    expect(component.isSelected).toHaveBeenCalled();
    expect(component.getCurrentBoard).toHaveBeenCalled();
    expect(component.reload).toHaveBeenCalled();
    compiled.query(By.css('.grid-item:first-child')).nativeElement.click();
    fixture.detectChanges();
    expect(component.cellClicked).toHaveBeenCalled();
    expect(compiled.query(By.css('.grid-container:first-child div:first-child')).classes['grid-item-highlight']).toBeTruthy();
  }));
});

describe('SudokuComponent Testing', () => {
  let component: SudokuComponent;
  let fixture: ComponentFixture<SudokuComponent>;
  let board: number[][];
  let injector: TestBed;
  let sudokuService: SudokuService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SudokuComponent],
      imports: [HttpClientTestingModule],
      providers: [HttpClient, HttpHandler, SudokuService]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(SudokuComponent);
      component = fixture.componentInstance;
      board = getEmptyBoard();
      injector = getTestBed();
      sudokuService = component.sudokuService;
      httpMock = injector.get(HttpTestingController);
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get random board on init', async(inject([SudokuService], (service) => {
    spyOn(component, 'getRandomBoard');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getRandomBoard).toHaveBeenCalled();
  })));

  it('reload with no selection should call the random board generation service', () => {
    spyOn(sudokuService, 'getRandomSudokuBoard').and.returnValue(of(board));
    spyOn(component, 'getRandomBoard');

    component.processBoard(board);
    component.reload();
    fixture.detectChanges();
    expect(component.getRandomBoard).toHaveBeenCalled();
  });

  it('reload with selection should call the sudoku solver service', () => {
    board[0][0] = 1;
    spyOn(sudokuService, 'solveSelectedSudokuBoard').and.returnValue(of(board));
    component.processBoard(board);
    component.selected[0][0] = true;
    fixture.detectChanges();
    spyOn(component, 'processBoard');
    component.reload();
    fixture.detectChanges();
    expect(sudokuService.solveSelectedSudokuBoard).toHaveBeenCalled();
    expect(component.processBoard).toHaveBeenCalled();
  });

  it('should call sudoku service to get a random board', () => {
    spyOn(sudokuService, 'getRandomSudokuBoard').and.returnValue(of(board));
    component.getRandomBoard();
    fixture.detectChanges();
    expect(component.getCurrentBoard).not.toBeNull();
    expect(sudokuService.getRandomSudokuBoard).toHaveBeenCalled();
    expect(component.getCurrentBoard()).toEqual(board);
    expect(component.isLoading()).toBeFalsy();
  });

  it('process board should initialize variables', () => {
    component.processBoard(board);
    expect(component.isLoading()).toEqual(false);
    expect(component.getCurrentBoard()).toEqual(board);
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        expect(component.selected[i][j]).toEqual(false);
      }
    }
  });

  it('cell click should toggle status of the cell', () => {
    component.processBoard(board);
    expect(component.selected[0][0]).toEqual(false);
    component.cellClicked(0, 0);
    expect(component.selected[0][0]).toEqual(true);
    component.cellClicked(0, 0);
    expect(component.selected[0][0]).toEqual(false);
  });

});
