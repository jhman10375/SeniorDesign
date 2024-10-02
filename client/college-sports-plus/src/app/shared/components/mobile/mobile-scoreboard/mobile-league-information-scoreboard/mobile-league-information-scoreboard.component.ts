import { Component, Input, OnInit } from '@angular/core';

import { LeagueScorboardModel } from '../../../../models/league-scoreboard.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'mobile-league-information-scoreboard',
  templateUrl: 'mobile-league-information-scoreboard.component.html',
})
export class MobileLeagueInformationScoreboardComponent implements OnInit {
  @Input() league: LeagueScorboardModel = new LeagueScorboardModel();

  constructor() {}

  ngOnInit() {}
}
