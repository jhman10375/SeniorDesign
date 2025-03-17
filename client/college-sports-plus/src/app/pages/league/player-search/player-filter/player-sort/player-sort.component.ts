import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'player-sort',
  templateUrl: 'player-sort.component.html',
})
export class PlayerSortComponent implements OnInit {
  @Input() sortFunction: 'School' | 'Name' | 'Number' | 'Proj PPG' | 'None' =
    'None';

  @Input() currentSortType: 'Up' | 'Down' | 'None' = 'None';

  @Input() currentSortFunction:
    | 'School'
    | 'Name'
    | 'Number'
    | 'Proj PPG'
    | 'None' = 'None';

  @Output() sortFunctionEmitter = new EventEmitter<
    'School' | 'Name' | 'Number' | 'Proj PPG'
  >();

  constructor() {}

  ngOnInit() {}

  setSortFunction(
    sortFunction: 'School' | 'Name' | 'Number' | 'Proj PPG' | 'None'
  ): void {
    if (sortFunction != 'None') {
      this.sortFunctionEmitter.emit(sortFunction);
    }
  }
}
