import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { MobileScoreBoardComponent } from '../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { SportEnum } from '../../shared/enums/sport.enum';
import { LeagueScorboardModel } from '../../shared/models/league-scoreboard.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { FastAPIService } from '../../shared/services/fastAPI/fast-api.service';

@Component({
  standalone: true,
  imports: [
    MobileScoreBoardComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
  ],
  providers: [AthleteService, FastAPIService],
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  readonly SportEnum = SportEnum;

  isMobile: boolean = false;

  leagueList: Observable<Array<LeagueScorboardModel>>;

  constructor(
    private leagueService: LeagueService,
    private fastAPIService: FastAPIService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.leagueList = this.leagueService.leagueScoreboard;

    this.leagueService.leagueScoreboard.subscribe({
      next: (l) => console.log(l),
    });

    this.fastAPIService.getStatus();
    this.fastAPIService.getTeams('ohio');
    this.fastAPIService.getLogos();
    // this.fastAPIService.getPlayers();
  }
  ngOnInit() {}
}
