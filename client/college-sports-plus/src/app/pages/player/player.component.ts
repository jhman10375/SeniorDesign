import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';

import { PlayerHeaderComponent } from '../../shared/components/shared/player-header/player-header.component';
import { SportEnum } from '../../shared/enums/sport.enum';
import { LeagueAthleteModel } from '../../shared/models/league-athlete.model';
import { LeaguePlayerModel } from '../../shared/models/league-player.model';
import { SchoolModel } from '../../shared/models/school.model';
import { BaseballPlayerStatsModel } from '../../shared/models/stats/baseball-player-stats.model';
import { BasketballPlayerStatsModel } from '../../shared/models/stats/basketball-player-stats.model';
import { FootballPlayerStatsModel } from '../../shared/models/stats/football-player-stats.model';
import { SoccerPlayerStatsModel } from '../../shared/models/stats/soccer-player-stats.model';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { LoadingService } from '../../shared/services/bl/loading.service';
import { SchoolService } from '../../shared/services/bl/school.service';
import { BaseballPlayerStatsComponent } from './stats/baseball-player/baseball-player.component';
import { BasketballPlayerStatsComponent } from './stats/basketball-player/basketball-player.component';
import { FootballPlayerStatsComponent } from './stats/football-player/football-player.component';
import { SoccerPlayerStatsComponent } from './stats/soccer-player/soccer-player.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PlayerHeaderComponent,
    PipesModule,
    SoccerPlayerStatsComponent,
    BasketballPlayerStatsComponent,
    BaseballPlayerStatsComponent,
    FootballPlayerStatsComponent,
  ],
  providers: [],
  selector: 'player',
  templateUrl: 'player.component.html',
})
export class PlayerComponent implements OnInit {
  isMobile: boolean = false;

  readonly SportEnum = SportEnum;

  player: LeagueAthleteModel | undefined = undefined;

  leaguePlayer: LeaguePlayerModel | undefined = undefined;

  school: SchoolModel | undefined = undefined;

  leagueType: SportEnum = SportEnum.None;

  footballPlayerStats: FootballPlayerStatsModel;

  basketballPlayerStats: BasketballPlayerStatsModel;

  baseballPlayerStats: BaseballPlayerStatsModel;

  soccerPlayerStats: SoccerPlayerStatsModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private athleteService: AthleteService,
    private leagueService: LeagueService,
    private schoolService: SchoolService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.isMobile = GeneralService.isMobile();

    this.loadingService.setIsLoading(true);

    const currentID = this.activatedRoute.snapshot.params['playerID'];

    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;
    const leagueID = segments[1].toString();
    this.leagueType =
      this.leagueService.getLeagueType(leagueID) ?? SportEnum.None;

    if (currentID !== '-1') {
      switch (this.leagueType) {
        case SportEnum.Football:
          combineLatest([
            this.athleteService.getFootballAthleteStatsByID(currentID),
            this.athleteService.getAthleteByID(currentID, this.leagueType),
          ])
            .pipe(take(1))
            .subscribe({
              next: ([stats, athlete]) => {
                if (stats && athlete) {
                  const p =
                    GeneralService.FastAPILeagueAthleteModelConverter(athlete);
                  this.schoolService
                    .getSchoolByName(p.Team)
                    .pipe(take(1))
                    .subscribe({
                      next: (school) => {
                        if (school != null) {
                          this.school = school;
                        }
                        this.leaguePlayer =
                          this.leagueService.CheckAthleteOnTeam(
                            leagueID,
                            currentID
                          );
                        if (this.leaguePlayer && p) {
                          p.PlayerID = this.leaguePlayer.ID;
                        }
                        this.player = p;
                        this.footballPlayerStats = stats;
                        console.log(stats);
                        console.log(this.player);
                        console.log(school);
                        this.loadingService.setIsLoading(false);
                      },
                    });
                }
              },
              error: (e) => console.error(e),
            });
          break;
        case SportEnum.Baseball:
          combineLatest([
            this.athleteService.getBaseballAthleteStatsByID(currentID),
            this.athleteService.getAthleteByID(currentID, this.leagueType),
          ])
            .pipe(take(1))
            .subscribe({
              next: ([stats, athlete]) => {
                if (stats && athlete) {
                  const p =
                    GeneralService.FastAPILeagueAthleteModelConverter(athlete);
                  this.schoolService
                    .getSchoolByName(p.Team)
                    .pipe(take(1))
                    .subscribe({
                      next: (school) => {
                        if (school != null) {
                          this.school = school;
                        }
                        this.leaguePlayer =
                          this.leagueService.CheckAthleteOnTeam(
                            leagueID,
                            currentID
                          );
                        if (this.leaguePlayer && p) {
                          p.PlayerID = this.leaguePlayer.ID;
                        }
                        this.player = p;
                        this.baseballPlayerStats = stats;
                        console.log(stats);
                        console.log(this.player);
                        console.log(school);
                        this.loadingService.setIsLoading(false);
                      },
                    });
                }
              },
              error: (e) => console.error(e),
            });
          break;
        case SportEnum.Basketball:
          combineLatest([
            this.athleteService.getBasketballAthleteStatsByID(currentID),
            this.athleteService.getAthleteByID(currentID, this.leagueType),
          ])
            .pipe(take(1))
            .subscribe({
              next: ([stats, athlete]) => {
                if (stats && athlete) {
                  const p =
                    GeneralService.FastAPILeagueAthleteModelConverter(athlete);
                  this.schoolService
                    .getSchoolByName(p.Team)
                    .pipe(take(1))
                    .subscribe({
                      next: (school) => {
                        if (school != null) {
                          this.school = school;
                        }
                        this.leaguePlayer =
                          this.leagueService.CheckAthleteOnTeam(
                            leagueID,
                            currentID
                          );
                        if (this.leaguePlayer && p) {
                          p.PlayerID = this.leaguePlayer.ID;
                        }
                        this.player = p;
                        this.basketballPlayerStats = stats;
                        console.log(stats);
                        console.log(this.player);
                        console.log(school);
                        this.loadingService.setIsLoading(false);
                      },
                    });
                }
              },
              error: (e) => console.error(e),
            });
          break;
        case SportEnum.Soccer:
          combineLatest([
            this.athleteService.getSoccerAthleteStatsByID(currentID),
            this.athleteService.getAthleteByID(currentID, this.leagueType),
          ])
            .pipe(take(1))
            .subscribe({
              next: ([stats, athlete]) => {
                if (stats && athlete) {
                  const p =
                    GeneralService.FastAPILeagueAthleteModelConverter(athlete);
                  this.schoolService
                    .getSchoolByName(p.Team)
                    .pipe(take(1))
                    .subscribe({
                      next: (school) => {
                        if (school != null) {
                          this.school = school;
                        }
                        this.leaguePlayer =
                          this.leagueService.CheckAthleteOnTeam(
                            leagueID,
                            currentID
                          );
                        if (this.leaguePlayer && p) {
                          p.PlayerID = this.leaguePlayer.ID;
                        }
                        this.player = p;
                        this.soccerPlayerStats = stats;
                        console.log(stats);
                        console.log(this.player);
                        console.log(school);
                        this.loadingService.setIsLoading(false);
                      },
                    });
                }
              },
              error: (e) => console.error(e),
            });
          break;
      }
      // this.athleteService
      //   .getAthleteByID(currentID, this.leagueType)
      //   .pipe(take(1))
      //   .subscribe({
      //     next: (a: PlayerFAPIModel | undefined) => {
      //       if (a) {
      //         const p = GeneralService.FastAPILeagueAthleteModelConverter(a);
      //         this.schoolService
      //           .getSchoolByName(p.Team)
      //           .pipe(take(1))
      //           .subscribe({
      //             next: (school) => {
      //               if (school != null) {
      //                 this.school = school;
      //               }
      //               this.leaguePlayer = this.leagueService.CheckAthleteOnTeam(
      //                 leagueID,
      //                 currentID
      //               );
      //               if (this.leaguePlayer && p) {
      //                 p.PlayerID = this.leaguePlayer.ID;
      //               }
      //               this.player = p;
      //               console.log(this.player);
      //               console.log(school);
      //             },
      //           });
      //       }
      //     },
      //     error: (e) => console.error(e),
      //   });
    }
    console.log(this.player);
  }

  ngOnInit() {}
}
