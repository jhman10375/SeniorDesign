import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { OrderListModule } from 'primeng/orderlist';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { PlayerFilterBase } from '../../player-search/player-filter/player-filter.base.component';
import { PlayerFilterComponent } from '../../player-search/player-filter/player-filter/player-filter.component';
import { PlayerSortComponent } from '../../player-search/player-filter/player-sort/player-sort.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    DragDropModule,
    PlayerFilterComponent,
    PlayerSortComponent,
  ],
  selector: 'draft-queue',
  styleUrls: ['draft-queue.component.scss'],
  templateUrl: 'draft-queue.component.html',
})
export class DraftQueueComponent extends PlayerFilterBase implements OnInit {
  @Input() currentlyPicking: boolean = false;

  @Input() endDraft: boolean = false;

  @Output() addToRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() removeFromRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() dialogPlayer = new EventEmitter<LeagueAthleteModel>();

  constructor() {
    super();
  }

  override ngOnInit() {}

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterEmitter.emit(athlete);
  }

  removeFromQueue(athlete: LeagueAthleteModel): void {
    this.removeFromRosterEmitter.emit(athlete);
  }

  onPlayerSelected(player: LeagueAthleteModel): void {
    this.dialogPlayer.emit(player);
  }
}
