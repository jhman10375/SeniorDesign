import { Component, Input, OnInit } from '@angular/core';

import { LeaguePlayerModel } from '../../../models/league-player.model';
import { LeagueScorboardModel } from '../../../models/league-scoreboard.model';
import { MobileLeagueInformationScoreboardComponent } from './mobile-league-information-scoreboard/mobile-league-information-scoreboard.component';
import { MobileTeamScoreboardComponent } from './mobile-team-scoreboard/mobile-team-scoreboard.component';

@Component({
  standalone: true,
  imports: [
    MobileLeagueInformationScoreboardComponent,
    MobileTeamScoreboardComponent,
  ],
  selector: 'mobile-scoreboard',
  styleUrls: ['mobile-scoreboard.component.scss'],
  templateUrl: 'mobile-scoreboard.component.html',
})
export class MobileScoreBoardComponent implements OnInit {
  @Input() hasDifferentContent: boolean = false;

  @Input() leagueInformationScoreboard: boolean = false;

  @Input() gameScoreboard: boolean = false;

  @Input() teamScoreboard: boolean = false;

  @Input() league: LeagueScorboardModel = new LeagueScorboardModel();

  @Input() player: LeaguePlayerModel | undefined = new LeaguePlayerModel();

  constructor() {}

  ngOnInit() {}
}
