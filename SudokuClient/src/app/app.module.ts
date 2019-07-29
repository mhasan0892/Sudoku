import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';

const appRoutes: Routes = [
  {
    path: 'sudoku/board',
    component: SudokuComponent,
    data: { title: 'Sudoku Board' }
  }];

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule
  ],
  exports: [
    SudokuComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule { }
