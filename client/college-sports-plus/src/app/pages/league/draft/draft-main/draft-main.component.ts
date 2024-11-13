import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-main',
  styleUrls: ['draft-main.component.scss'],
  templateUrl: 'draft-main.component.html',
})
export class DraftMainComponent implements OnInit {
  @Input() athletes: Array<LeagueAthleteModel> = [];

  @Input() currentlyPicking: boolean = false;

  @Output() addToQueueEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() addToRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  constructor() {}

  ngOnInit() {}

  addToQueue(athlete: LeagueAthleteModel): void {
    this.addToQueueEmitter.emit(athlete);
  }

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterEmitter.emit(athlete);
  }
}
