import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { PlayerFilterBase } from '../../player-search/player-filter/player-filter.base.component';
import { PlayerFilterComponent } from '../../player-search/player-filter/player-filter/player-filter.component';
import { PlayerSortComponent } from '../../player-search/player-filter/player-sort/player-sort.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    PlayerSortComponent,
    PlayerFilterComponent,
  ],
  selector: 'draft-main',
  styleUrls: ['draft-main.component.scss'],
  templateUrl: 'draft-main.component.html',
})
export class DraftMainComponent extends PlayerFilterBase implements OnInit {
  // @Input() override set athletes(v: Array<LeagueAthleteModel>) {
  //   if (v) {
  //     this.playersReadonly = v;
  //   }
  // }

  @Input() queue: Array<LeagueAthleteModel> = [];

  @Input() currentlyPicking: boolean = false;

  @Input() endDraft: boolean = false;

  @Output() addToQueueEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() addToRosterEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() dialogPlayerEmitter = new EventEmitter<LeagueAthleteModel>();

  @Output() searchEmitter = new EventEmitter<void>();

  constructor() {
    super();
  }

  override ngOnInit() {}

  addToQueue(athlete: LeagueAthleteModel): void {
    this.addToQueueEmitter.emit(athlete);
  }

  addToRoster(athlete: LeagueAthleteModel): void {
    this.addToRosterEmitter.emit(athlete);
  }

  onPlayerSelected(player: LeagueAthleteModel): void {
    this.dialogPlayerEmitter.emit(player);
  }

  onSearch(): void {
    this.searchEmitter.emit();
  }

  inQueue(athlete: LeagueAthleteModel): boolean {
    if (this.queue.find((x) => x.AthleteID === athlete.AthleteID)) {
      return true;
    } else {
      return false;
    }
  }
}
