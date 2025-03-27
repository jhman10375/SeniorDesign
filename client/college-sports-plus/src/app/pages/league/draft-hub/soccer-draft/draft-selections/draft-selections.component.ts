import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
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
      this.numOfRounds = Array.from({ length: v }, (_, i) => i + 1);
      this._numberOfRounds = v;
    }
  }

  get numberOfRounds() {
    return this._numberOfRounds;
  }

  @Input() reverse: boolean = false;

  @Output() dialogPlayer = new EventEmitter<LeagueAthleteModel>();

  numOfRounds: Array<number> = [];

  private _numberOfRounds: number;

  constructor() {}

  ngOnInit() {}

  onPlayerSelected(player: LeagueAthleteModel | null): void {
    if (player) {
      this.dialogPlayer.emit(player);
    }
  }
}
