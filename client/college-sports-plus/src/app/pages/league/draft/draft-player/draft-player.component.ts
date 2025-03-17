import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { SubLoadingComponent } from '../../../../shared/components/shared/sub-loading/sub-loading.component';
import { SportEnum } from '../../../../shared/enums/sport.enum';
import { BaseballPlayerStatsModel } from '../../../../shared/models/stats/baseball-player-stats.model';
import { BasketballPlayerStatsModel } from '../../../../shared/models/stats/basketball-player-stats.model';
import { FootballPlayerStatsModel } from '../../../../shared/models/stats/football-player-stats.model';
import { SoccerPlayerStatsModel } from '../../../../shared/models/stats/soccer-player-stats.model';
import { AthleteService } from '../../../../shared/services/bl/athlete.service';
import { BaseballPlayerStatsComponent } from '../../../player/stats/baseball-player/baseball-player.component';
import { BasketballPlayerStatsComponent } from '../../../player/stats/basketball-player/basketball-player.component';
import { FootballPlayerStatsComponent } from '../../../player/stats/football-player/football-player.component';
import { SoccerPlayerStatsComponent } from '../../../player/stats/soccer-player/soccer-player.component';
import { FootballDraftPlayerModel } from '../models/sport-player/football.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FootballPlayerStatsComponent,
    BaseballPlayerStatsComponent,
    BasketballPlayerStatsComponent,
    SoccerPlayerStatsComponent,
    SubLoadingComponent,
  ],
  selector: 'draft-player',
  templateUrl: 'draft-player.component.html',
})
export class DraftPlayerComponent implements OnInit {
  readonly SportEnum = SportEnum;

  // @Input() set player(v: LeagueAthleteModel) {
  //   this.isLoading.set(true);
  //   if (v && v.AthleteID.length > 0) {
  //     switch (this.leagueType) {
  //       case SportEnum.Football:
  //         this.athleteService
  //           .getFootballAthleteStatsByID(v.AthleteID)
  //           .pipe(take(1))
  //           .subscribe({
  //             next: (x) => {
  //               this.footballPlayerStats = x;
  //               this.isLoading.set(false);
  //             },
  //           });
  //         break;
  //       case SportEnum.Baseball:
  //         this.athleteService
  //           .getBaseballAthleteStatsByID(v.AthleteID)
  //           .pipe(take(1))
  //           .subscribe({
  //             next: (x) => {
  //               this.baseballPlayerStats = x;
  //               this.isLoading.set(false);
  //             },
  //           });
  //         break;
  //       case SportEnum.Basketball:
  //         this.athleteService
  //           .getBasketballAthleteStatsByID(v.AthleteID)
  //           .pipe(take(1))
  //           .subscribe({
  //             next: (x) => {
  //               this.basketballPlayerStats = x;
  //               this.isLoading.set(false);
  //             },
  //           });
  //         break;
  //       case SportEnum.Soccer:
  //         this.athleteService
  //           .getSoccerAthleteStatsByID(v.AthleteID)
  //           .pipe(take(1))
  //           .subscribe({
  //             next: (x) => {
  //               this.soccerPlayerStats = x;
  //               this.isLoading.set(false);
  //             },
  //           });

  //         break;
  //     }
  //   }
  // }

  @Input() set footballDraftPlayer(v: FootballDraftPlayerModel) {
    this.isLoading.set(true);
    if (v && v.Athlete && v.Athlete.AthleteID.length > 0) {
      setTimeout(() => {
        this.footballPlayerStats = v.Stats;
        this.isLoading.set(false);
      }, 500);
    }
  }

  @Input() set baseballDraftPlayer(v: FootballDraftPlayerModel) {
    // this.isLoading.set(true);
    // if (v && v.Athlete && v.Athlete.AthleteID.length > 0) {
    //   setTimeout(() => {
    //     this.footballPlayerStats = v.Stats;
    //     this.isLoading.set(false);
    //   }, 500);
    // }
  }

  @Input() set basketballDraftPlayer(v: FootballDraftPlayerModel) {
    // this.isLoading.set(true);
    // if (v && v.Athlete && v.Athlete.AthleteID.length > 0) {
    //   setTimeout(() => {
    //     this.footballPlayerStats = v.Stats;
    //     this.isLoading.set(false);
    //   }, 500);
    // }
  }

  @Input() set soccerDraftPlayer(v: FootballDraftPlayerModel) {
    // this.isLoading.set(true);
    // if (v && v.Athlete && v.Athlete.AthleteID.length > 0) {
    //   setTimeout(() => {
    //     this.footballPlayerStats = v.Stats;
    //     this.isLoading.set(false);
    //   }, 500);
    // }
  }

  @Input() leagueType: SportEnum;

  isLoading: WritableSignal<boolean> = signal(true);

  footballPlayerStats: FootballPlayerStatsModel;

  baseballPlayerStats: BaseballPlayerStatsModel;

  basketballPlayerStats: BasketballPlayerStatsModel;

  soccerPlayerStats: SoccerPlayerStatsModel;

  constructor(private athleteService: AthleteService) {
    this.isLoading.set(true);
  }

  ngOnInit() {}
}
