import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}
}
