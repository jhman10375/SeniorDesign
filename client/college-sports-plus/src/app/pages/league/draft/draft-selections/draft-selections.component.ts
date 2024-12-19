import { Component, Input, OnInit } from '@angular/core';

import { DraftSelectionModel } from '../models/draft-selection.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-selections',
  styleUrls: ['draft-selections.component.scss'],
  templateUrl: 'draft-selections.component.html',
})
export class DraftSelectionsComponent implements OnInit {
  @Input() selections: Array<DraftSelectionModel>;

  @Input() set numberOfRounds(v: number) {
    if (v) {
      this.numOfRounds = Array.from({ length: 10 }, (_, i) => i + 1);
      this._numberOfRounds = v;
    }
  }
  numOfRounds: Array<number> = [];

  get numberOfRounds() {
    return this._numberOfRounds;
  }

  private _numberOfRounds: number;

  constructor() {}

  ngOnInit() {}
}
