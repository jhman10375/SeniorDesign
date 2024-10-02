import { Component, Input, OnInit } from '@angular/core';

import { LeagueScorboardModel } from '../../../models/league-scoreboard.model';
import { MobileLeagueInformationScoreboardComponent } from './mobile-league-information-scoreboard/mobile-league-information-scoreboard.component';

@Component({
  standalone: true,
  imports: [MobileLeagueInformationScoreboardComponent],
  selector: 'mobile-scoreboard',
  styleUrls: ['mobile-scoreboard.component.scss'],
  templateUrl: 'mobile-scoreboard.component.html',
})
export class MobileScoreBoardComponent implements OnInit {
  @Input() hasDifferentContent: boolean = false;

  @Input() leagueInformationScoreboard: boolean = false;

  @Input() gameScoreboard: boolean = false;

  @Input() league: LeagueScorboardModel = new LeagueScorboardModel();

  constructor() {}

  ngOnInit() {}
}
