import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { isEmpty } from 'lodash';
import { Slice } from 'src/app/components/pagination/pagination.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  tableData: any[] = [];

  @Input() set data(value: any[]) {
    if (!value || isEmpty(value)) return;

    this.tableData = value
    this.length = value.length;
    this.colNames = Object.keys(value[0]);
  }

  @Output() modalEmitter: EventEmitter<any> = new EventEmitter<any>();

  public sliceValues: Slice = { start: 0, end: 0 };

  public colNames: string[] = [];

  public length: number = 0;


  constructor(private cdRef:ChangeDetectorRef) { }

  getSlice(sliceValues: Slice) {
    this.sliceValues = sliceValues;
    this.cdRef.detectChanges();
  }

  openModal(data: any) {
    this.modalEmitter.emit(data);
  }

}
