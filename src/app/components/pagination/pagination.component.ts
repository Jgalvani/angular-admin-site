import { Component, EventEmitter, Input, Output } from '@angular/core';
import { range } from 'lodash';


export interface Slice {
  start: number,
  end: number,
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  private _length: number = 0;
  @Input() set length(value: number) {
    if (!value) return;

    this._length = value;
    this.pageSize = this.pageSizes[0];
    this.lastPage = this.getLastPage();
    this.page = this.getPage();
    this.rangeLength = this.getRangeLength();
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  @Output() sliceEmitter: EventEmitter<Slice> = new EventEmitter<Slice>();

  sliceValues: Slice = { start: 0, end:0 };
  public page: number = 1;
  public lastPage: number = 0;

  private pageSize: number = 0;
  public pageSizes: number[] = [10, 20, 30];

  private rangeLength: number = 0;
  private maxRangeLength: number = 3;
  public buttonRange: number[] = [];


  constructor() { }

  emitSlice() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.sliceValues = { start, end };
    this.sliceEmitter.emit(this.sliceValues);
  }

  // Getters

  getPage() {
    return this.page < 1
    ? 1
    : this.page > this.lastPage
    ? this.lastPage
    : this.page;
  }

  getLastPage(): number {
    return Math.ceil( this._length / this.pageSize );
  }

  getRangeLength(): number {
    return this.lastPage > this.maxRangeLength
      ? this.maxRangeLength
      : this.lastPage;
  }

  getButtonRange(): number[] {
    const start = this.page - Math.floor(this.rangeLength / 2)
    const end = this.page + Math.ceil(this.rangeLength / 2)

    if ( start < 1) {
      return range(1, this.rangeLength + 1 );

    } else if ( end > this.lastPage) {
      return range(this.lastPage - this.rangeLength + 1, this.lastPage + 1);
    }

    return range(start, end + 1);
  }

  // Change page
  displayFirstPage() {
    if (this.page === 1) return;
    this.page = 1
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  displayPreviousPage() {
    if (this.page === 1) return;
    this.page = this.page - 1
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  displayNextPage() {
    if (this.page === this.lastPage) return;
    this.page = this.page + 1;
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  displayLastPage() {
    if (this.page === this.lastPage) return;
    this.page = this.lastPage;
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  changePage(page: number) {
    if (this.page === page) return;
    this.page = page;
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }

  changePageSize(event: any) {
    this.pageSize = +event.target.value;
    this.lastPage = this.getLastPage();
    this.rangeLength = this.getRangeLength();
    this.page = 1;
    this.emitSlice();
    this.buttonRange = this.getButtonRange();
  }
}
