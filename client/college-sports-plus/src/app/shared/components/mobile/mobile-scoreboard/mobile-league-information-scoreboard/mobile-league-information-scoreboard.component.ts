import { Component, Input, OnInit } from '@angular/core';

import { LeagueScorboardModel } from '../../../../models/league-scoreboard.model';
import { NumberLogoComponent } from '../../../shared/number-logo/number-logo.component';

@Component({
  standalone: true,
  imports: [NumberLogoComponent],
  selector: 'mobile-league-information-scoreboard',
  styleUrls: ['mobile-league-information-scoreboard.component.scss'],
  templateUrl: 'mobile-league-information-scoreboard.component.html',
})
export class MobileLeagueInformationScoreboardComponent implements OnInit {
  @Input() league: LeagueScorboardModel = new LeagueScorboardModel();

  constructor() {}

  ngOnInit() {}
}
