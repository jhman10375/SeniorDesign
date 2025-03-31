import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { PlayerFilterBase } from '../../../player-search/player-filter/player-filter.base.component';
import { PlayerSortComponent } from '../../../player-search/player-filter/player-sort/player-sort.component';

@Component({
  standalone: true,
  imports: [CommonModule, PlayerSortComponent],
  selector: 'draft-my-selections',
  styleUrls: ['draft-my-selections.component.scss'],
  templateUrl: 'draft-my-selections.component.html',
})
export class DraftMySelectionsComponent
  extends PlayerFilterBase
  implements OnInit
{
  @Output() dialogPlayer = new EventEmitter<LeagueAthleteModel>();

  constructor() {
    super();
  }

  override ngOnInit() {}

  onPlayerSelected(player: LeagueAthleteModel): void {
    this.dialogPlayer.emit(player);
  }
}
