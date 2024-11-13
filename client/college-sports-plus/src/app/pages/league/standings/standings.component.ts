import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MobileScoreBoardComponent } from '../../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { LeagueModel } from '../../../shared/models/league.model';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';

@Component({
  standalone: true,
  imports: [MobileScoreBoardComponent],
  selector: 'standings',
  templateUrl: 'standings.component.html',
})
export class StandingsComponent implements OnInit {
  isMobile: boolean = false;

  currentLeagueID: string;

  currentLeague: LeagueModel | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService
  ) {
    this.isMobile = GeneralService.isMobile();

    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];
    if (leagueID) {
      this.currentLeagueID = leagueID;
      this.currentLeague = this.leagueService.getLeague(leagueID);
      console.log(this.currentLeague);
    }
  }

  ngOnInit() {}
}
