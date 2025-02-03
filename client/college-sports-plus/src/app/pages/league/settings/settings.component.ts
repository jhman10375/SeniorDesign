import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeagueModel } from '../../../shared/models/league.model';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { UserService } from '../../../shared/services/dl/user.service';
import { FootballSettingsViewEditComponent } from './sports/football/football-settings-view-edit.component';

@Component({
  standalone: true,
  imports: [CommonModule, PipesModule, FootballSettingsViewEditComponent],
  selector: 'settings',
  templateUrl: 'settings.component.html',
})
export class SettingsComponent implements OnInit {
  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  league: LeagueModel | undefined = undefined;

  isLeagueManager: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService,
    private userService: UserService
  ) {
    this.isMobile = GeneralService.isMobile();

    const leagueID: string =
      this.activatedRoute.parent?.snapshot.params['leagueID'];
    if (leagueID) {
      this.league = this.leagueService.getLeague(leagueID) ?? undefined;
      this.isLeagueManager =
        this.league?.Manager.PlayerID === this.userService.getUser()?.ID;
    }
  }

  ngOnInit() {}
}
