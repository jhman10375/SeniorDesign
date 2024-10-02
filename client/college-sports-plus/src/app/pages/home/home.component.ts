import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { MobileScoreBoardComponent } from '../../shared/components/mobile/mobile-scoreboard/mobile-scoreboard.component';
import { SportEnum } from '../../shared/enums/sport.enum';
import { LeagueScorboardModel } from '../../shared/models/league-scoreboard.model';
import { GeneralService } from '../../shared/services/general-service.service';
import { LeagueService } from '../../shared/services/league.service';

@Component({
  standalone: true,
  imports: [MobileScoreBoardComponent, RouterLink, CommonModule],
  providers: [LeagueService],
  selector: 'home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  readonly SportEnum = SportEnum;

  isMobile: boolean = false;

  leagueList: Observable<Array<LeagueScorboardModel>>;

  constructor(private leagueService: LeagueService) {
    this.isMobile = GeneralService.isMobile();

    this.leagueList = this.leagueService.leagueScoreboard;
  }
  ngOnInit() {}
}
