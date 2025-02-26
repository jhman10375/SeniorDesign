import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LeaguePlayerModel } from '../../../../models/league-player.model';

@Component({
  standalone: true,
  imports: [],
  styleUrls: ['mobile-team-scoreboard.component.scss'],
  selector: 'mobile-team-scoreboard',
  templateUrl: 'mobile-team-scoreboard.component.html',
})
export class MobileTeamScoreboardComponent implements OnInit {
  @Input() player: LeaguePlayerModel | undefined = new LeaguePlayerModel();

  @Output() openMyTeamSettingsDialogEmitter = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  openMyTeamSettings(): void {
    this.openMyTeamSettingsDialogEmitter.emit();
  }
}
