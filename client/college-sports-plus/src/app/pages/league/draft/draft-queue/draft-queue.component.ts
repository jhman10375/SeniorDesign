import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-queue',
  templateUrl: 'draft-queue.component.html',
})
export class DraftQueueComponent implements OnInit {
  @Input() athletes: Array<LeagueAthleteModel> = [];

  @Input() currentlyPicking: boolean = false;

  @Output() addToRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() removeFromRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  constructor() {}

  ngOnInit() {}

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterEmitter.emit(athlete);
  }

  removeFromQueue(athlete: LeagueAthleteModel): void {
    this.removeFromRosterEmitter.emit(athlete);
  }
}
