import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { BaseballDraftComponent } from './baseball-draft/draft.component';
import { BasketballDraftComponent } from './basketball-draft/draft.component';
import { FootballDraftComponent } from './football-draft/draft.component';
import { SoccerDraftComponent } from './soccer-draft/draft.component';

@Component({
  standalone: true,
  imports: [
    FootballDraftComponent,
    SoccerDraftComponent,
    BasketballDraftComponent,
    BaseballDraftComponent,
  ],
  selector: 'draft-hub',
  templateUrl: 'draft-hub.component.html',
})
export class DraftHubComponent implements OnInit {
  readonly SportEnum = SportEnum;

  leagueType: SportEnum = SportEnum.None;

  constructor(
    private leagueService: LeagueService,
    private router: Router
  ) {
    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;
    const leagueID = segments[1].toString();
    this.leagueType =
      this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;
  }

  ngOnInit() {}
}
