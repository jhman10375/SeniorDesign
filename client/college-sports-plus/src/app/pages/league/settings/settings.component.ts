import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeagueModel } from '../../../shared/models/league.model';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { UserService } from '../../../shared/services/bl/user.service';
import { BaseballSettingsViewEditComponent } from './sports/baseball/baseball-settings-view-edit.component';
import { BasketballSettingsViewEditComponent } from './sports/basketball/basketball-settings-view-edit.component';
import { FootballSettingsViewEditComponent } from './sports/football/football-settings-view-edit.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PipesModule,
    FootballSettingsViewEditComponent,
    BasketballSettingsViewEditComponent,
    BaseballSettingsViewEditComponent,
  ],
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
    }

    this.userService.CurrentUser.pipe(take(1)).subscribe({
      next: (user) => {
        this.isLeagueManager =
          this.league?.Manager?.PlayerID === user.ID ?? false;
      },
    });
  }

  ngOnInit() {}
}
