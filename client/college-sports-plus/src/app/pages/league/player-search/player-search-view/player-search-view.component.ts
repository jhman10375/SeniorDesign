import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { PipesModule } from '../../../../shared/pipes/pipes.module';

@Component({
  standalone: true,
  imports: [PipesModule],
  selector: 'player-search-view',
  styleUrls: ['../player-search.component.scss'],
  templateUrl: 'player-search-view.component.html',
})
export class PlayerSearchViewComponent implements OnInit {
  @Input() athleteSelection: Array<LeagueAthleteModel> | undefined = undefined;

  @Input() draftMode: boolean = false;

  @Input() endDraft: boolean = false;

  @Input() myPick: boolean = false;

  @Input() queue: Array<LeagueAthleteModel> = [];

  @Output() addToQueueFromSearchEmitter =
    new EventEmitter<LeagueAthleteModel>();

  @Output() addToRosterFromSearchEmitter =
    new EventEmitter<LeagueAthleteModel>();

  @Output() dialogPlayerEmitter = new EventEmitter<LeagueAthleteModel>();

  constructor() {}

  ngOnInit() {}

  addToQueue(athlete: LeagueAthleteModel): void {
    this.addToQueueFromSearchEmitter.emit(athlete);
  }

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterFromSearchEmitter.emit(athlete);
  }

  onPlayerSelected(player: LeagueAthleteModel): void {
    this.dialogPlayerEmitter.emit(player);
  }
}
