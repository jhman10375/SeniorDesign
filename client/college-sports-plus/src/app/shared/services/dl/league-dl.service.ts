import { Injectable, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subject,
  take,
  tap,
} from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';
import { AthleteService } from '../bl/athlete.service';
import { LoadingService } from '../bl/loading.service';
import { SchoolService } from '../bl/school.service';
import { UserService } from '../bl/user.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { CollectionsEnum } from '../firebase/enums/collections.enum';
import { FirebaseService } from '../firebase/firebase-base.service';
import { FirebaseCrud } from '../firebase/interfaces/firebase-crud.interface';
import { LeagueSeasonDLService } from './league-season-dl.service';
import { LeagueSettingsDLService } from './league-settings-dl.service';
import { LeagueDLModel } from './models/league-dl.model';
import { LeagueGameDLModel } from './models/league-game-dl.model';
import { LeagueWeekDLModel } from './models/league-week-dl.model';
import { BaseballLeagueSettingsDLModel } from './models/settings/Baseball/baseball-league-settings-dl.model';
import { BasketballLeagueSettingsDLModel } from './models/settings/Basketball/basketball-league-settings-dl.model';
import { FootballLeagueSettingsDLModel } from './models/settings/Football/football-league-settings-dl.model';
import { SoccerLeagueSettingsDLModel } from './models/settings/Soccer/soccer-league-settings-dl.model';
import { PlayerDLService } from './player-dl.service';

@Injectable({ providedIn: 'root' })
export class LeagueDLService
  extends FirebaseService<LeagueDLModel>
  implements FirebaseCrud<LeagueDLModel>, OnDestroy
{
  league: Observable<Array<LeagueModel>>;

  leagueDL: Observable<Array<LeagueDLModel>>;

  _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leagueDL = new BehaviorSubject<Array<LeagueDLModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    private playerDLService: PlayerDLService,
    private leagueSettingsDLService: LeagueSettingsDLService,
    private athleteService: AthleteService,
    private leagueSeasonDLService: LeagueSeasonDLService,
    private schoolsService: SchoolService,
    private fastAPIService: FastAPIService,
    private loadingService: LoadingService,
    private currentUserService: UserService,
    angularFirestore: AngularFirestore
  ) {
    super(angularFirestore);
    this.league = this._league.asObservable();
    this.leagueDL = this._leagueDL.asObservable();

    // this.getLeaguesWithIDs(['0']).then((x) =>
    //   x.docs.forEach((y) => console.log(y.data()))
    // );

    // this.leagueSeasonDLService.seasonDL
    //   .pipe(skip(2), takeUntil(this.unsubscribe))
    //   .subscribe({
    //     next: (season) => {
    //       this.schoolsService.schools.pipe(take(1)).subscribe({
    //         next: (schools) => {
    //           this.athleteDLService
    //             .getAthletesAPI()
    //             .pipe(take(1))
    //             .subscribe({
    //               next: (a) => {
    //                 // this.convertLeagues(a, schools);
    //                 this.convertLeagues2(a, schools);
    //               },
    //             });
    //         },
    //       });
    //     },
    //   });

    // this.initializeLeagues();
    // this.convertLeagues();
  }

  initialize(): void {
    throw new Error('Method not implemented.');
  }

  addEntity(model: LeagueDLModel): void {
    throw new Error('Method not implemented.');
  }

  addEntityNeedsID(model: LeagueDLModel): void {
    throw new Error('Method not implemented.');
  }

  deleteEntity(model: LeagueDLModel): void {
    throw new Error('Method not implemented.');
  }

  updateEntity(model: LeagueDLModel): void {
    throw new Error('Method not implemented.');
  }

  getLeaguesWithIDs(
    LeagueIDs: Array<string>
  ): Promise<QuerySnapshot<Array<LeagueDLModel>>> {
    return this.queryGroupSingleWhereConditionNoLimit(
      CollectionsEnum.League,
      'ID',
      'in',
      LeagueIDs
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribe.next();
  }

  addPlayerToLeague(leagueID: string, playerID: string): void {
    this.queryGroupSingleWhereConditionNoLimit(
      CollectionsEnum.League,
      'ID',
      '==',
      leagueID
    ).then((league) => {
      this.addPlayerToSeason(leagueID, playerID);
      const l: LeagueDLModel = league.docs[0].data();
      l.PlayerIDs = [...l.PlayerIDs, playerID];
      this.updateNestedOBJ(l, CollectionsEnum.League).then(() => {
        this.schoolsService.schools.pipe(take(1)).subscribe({
          next: (schools) => {
            combineLatest([
              this.currentUserService.CurrentUser,
              this.athleteService.players,
              this.athleteService.basketballPlayers,
              this.athleteService.baseballPlayers,
              this.athleteService.soccerPlayers,
            ])
              .pipe(take(1))
              .subscribe({
                next: ([
                  user,
                  fbPlayers,
                  bkballPlayers,
                  bsballPlayers,
                  sccPlayers,
                ]) => {
                  // console.log([user, fbPlayers, bkballPlayers]);
                  this.convertLeagues2(
                    [...user.LeagueIDs],
                    fbPlayers,
                    bkballPlayers,
                    bsballPlayers,
                    sccPlayers,
                    schools
                  );
                },
              });
          },
        });
      });
    });
  }

  setDraftComplete(leagueID: string, complete: boolean): void {
    this.queryGroupSingleWhereConditionNoLimit(
      CollectionsEnum.League,
      'ID',
      '==',
      leagueID
    ).then((league) => {
      const l: LeagueDLModel = league.docs[0].data();
      l.DraftComplete = complete;
      this.updateNestedOBJ(l, CollectionsEnum.League).then(() => {
        this.schoolsService.schools.pipe(take(1)).subscribe({
          next: (schools) => {
            combineLatest([
              this.currentUserService.CurrentUser,
              this.athleteService.players,
              this.athleteService.basketballPlayers,
              this.athleteService.baseballPlayers,
              this.athleteService.soccerPlayers,
            ])
              .pipe(take(1))
              .subscribe({
                next: ([
                  user,
                  fbPlayers,
                  bkballPlayers,
                  bsballPlayers,
                  sccPlayers,
                ]) => {
                  // console.log([user, fbPlayers, bkballPlayers]);
                  this.convertLeagues2(
                    [...user.LeagueIDs],
                    fbPlayers,
                    bkballPlayers,
                    bsballPlayers,
                    sccPlayers,
                    schools
                  );
                },
              });
          },
        });
      });
    });
  }

  addPlayerToSeason(leagueID: string, playerID: string): void {
    let scheduleID: string | null = null;
    this.leagueSeasonDLService.getSeason(leagueID).then((seasonDL) => {
      seasonDL.docs.forEach((x) => {
        const week: LeagueWeekDLModel = x.data();
        if (scheduleID == null) {
          week.Games.forEach((game) => {
            if (
              game.AwayTeamPlayerID &&
              game.AwayTeamPlayerID.length < 3 &&
              (scheduleID == null || scheduleID > game.AwayTeamPlayerID)
            ) {
              scheduleID = game.AwayTeamPlayerID;
            } else if (
              game.HomeTeamPlayerID &&
              game.HomeTeamPlayerID.length < 3 &&
              (scheduleID == null || scheduleID > game.HomeTeamPlayerID)
            ) {
              scheduleID = game.HomeTeamPlayerID;
            }
          });
        }

        const game: LeagueGameDLModel | undefined = week.Games.find(
          (x) =>
            x.AwayTeamPlayerID == scheduleID || x.HomeTeamPlayerID == scheduleID
        );
        if (game && game.AwayTeamPlayerID == scheduleID) {
          game.AwayTeamPlayerID = playerID;
        } else if (game && game.HomeTeamPlayerID == scheduleID) {
          game.HomeTeamPlayerID = playerID;
        }

        this.leagueSeasonDLService.updateEntity(week);
      });
    });
  }

  convertLeagues2(
    leagueIDs: Array<string>,
    footballAthletes: Array<LeagueAthleteModel>,
    basketballAthletes: Array<LeagueAthleteModel>,
    baseballAthletes: Array<LeagueAthleteModel>,
    soccerAthletes: Array<LeagueAthleteModel>,
    schools: Array<SchoolModel>
  ): void {
    //  Observable<Array<LeagueModel>>
    const leaguesDL: Array<LeagueDLModel> = this._leagueDL.value;
    const league: Array<LeagueModel> = [];
    this.getLeaguesWithIDs(leagueIDs).then((leagues) => {
      leagues.docs.forEach((leagueDoc) => {
        // console.log(leagueDoc.data());
        let l = [leagueDoc.data() as any];
        const x: Array<LeagueDLModel> = l;
        x.forEach((leagueDL) => {
          // console.log(leagueDL);
          // this.leagueSettingsDLService.FootballSettingsDLtoBL(
          //   x.Settings as FootballLeagueSettingsDLModel
          // )
          /////////////////////////////////////////////////////////////////////////////
          let fullSeason: Array<LeagueWeekDLModel> = [];
          this.leagueSeasonDLService
            .getSeason(leagueDL.ID)
            .then((seasonDocs) => {
              seasonDocs.docs.forEach(
                (season) => (fullSeason = [...fullSeason, season.data()])
              );
              // console.log(y.data());
              this.playerDLService
                .getPlayers(leagueDL.PlayerIDs)
                .pipe(
                  // tap((x) => console.log(x)),
                  map((x) => {
                    x.forEach((y) => {
                      this.fastAPIService
                        .getSchoolByName(y.School.School)
                        .pipe(tap((school) => (y.School = school ?? y.School)));
                    });
                    return x;
                  })
                )
                .subscribe({
                  next: (players) => {
                    const settingsMap = new Map<
                      SportEnum,
                      | FootballLeagueSettingsModel
                      | BaseballLeagueSettingsModel
                      | BasketballLeagueSettingsModel
                      | SoccerLeagueSettingsModel
                    >([
                      [
                        SportEnum.Football,
                        this.leagueSettingsDLService.FootballSettingsDLtoBL(
                          leagueDL.Settings as FootballLeagueSettingsDLModel
                        ),
                      ],
                      [
                        SportEnum.Baseball,
                        this.leagueSettingsDLService.BaseballSettingsDLtoBL(
                          leagueDL.Settings as BaseballLeagueSettingsDLModel
                        ),
                      ],
                      [
                        SportEnum.Basketball,
                        this.leagueSettingsDLService.BasketballSettingsDLtoBL(
                          leagueDL.Settings as BasketballLeagueSettingsDLModel
                        ),
                      ],
                      [
                        SportEnum.Soccer,
                        this.leagueSettingsDLService.SoccerSettingsDLtoBL(
                          leagueDL.Settings as SoccerLeagueSettingsDLModel
                        ),
                      ],
                    ]);
                    const l: LeagueModel = new LeagueModel();
                    l.ID = leagueDL.ID;
                    l.DraftDate = new Date(leagueDL.DraftDate);
                    l.DraftComplete = leagueDL.DraftComplete;
                    l.Name = leagueDL.Name;
                    l.LeagueType = leagueDL.LeagueType;
                    // l.Settings = this.leagueSettingsDLService.getSettingsModel(
                    //   lDL.ID,
                    //   lDL.LeagueType
                    // );
                    l.Settings =
                      settingsMap.get(l.LeagueType) ??
                      new FootballLeagueSettingsModel();
                    l.Players = players.filter((x) => x.ID && x.ID.length > 0);
                    // l.Players.forEach((p) => {
                    //   this.fastAPIService
                    //     .getSchoolByID(p.School.ID)
                    //     .pipe(tap((t) => (p.School = t ?? p.School)));
                    // });
                    // l.Players = this.playerDLService.getLeague(lDL.PlayerIDs, schools);
                    const manager = l.Players.find(
                      (x) => x.ID == leagueDL.ManagerID
                    );
                    if (manager) {
                      l.Manager = manager;
                      l.Settings.GeneralSettingsModel.LeagueManager = manager;
                    }
                    // l.Season = fullSeason;
                    switch (l.LeagueType) {
                      case SportEnum.Football:
                        l.Season = this.leagueSeasonDLService.buildSeason(
                          fullSeason,
                          leagueDL.LeagueType,
                          footballAthletes
                        );
                        //Will probably have an error since l is not really defined here at all
                        l.Athletes = footballAthletes;
                        break;
                      case SportEnum.Baseball:
                        l.Season = this.leagueSeasonDLService.buildSeason(
                          fullSeason,
                          leagueDL.LeagueType,
                          baseballAthletes
                        );
                        //Will probably have an error since l is not really defined here at all
                        l.Athletes = baseballAthletes;
                        break;
                      case SportEnum.Basketball:
                        l.Season = this.leagueSeasonDLService.buildSeason(
                          fullSeason,
                          leagueDL.LeagueType,
                          basketballAthletes
                        );
                        //Will probably have an error since l is not really defined here at all
                        l.Athletes = basketballAthletes;
                        break;
                      case SportEnum.Soccer:
                        l.Season = this.leagueSeasonDLService.buildSeason(
                          fullSeason,
                          leagueDL.LeagueType,
                          soccerAthletes
                        );
                        //Will probably have an error since l is not really defined here at all
                        l.Athletes = soccerAthletes;
                        break;
                      default:
                        break;
                    }
                    // l.Season = this.leagueSeasonDLService.getSeason(
                    //   lDL.ID,
                    //   lDL.LeagueType,
                    //   athletes
                    // );
                    // console.log(l.Season);
                    league.push(l);
                    const leagueFiltered: Array<LeagueModel> = league.filter(
                      (x) => x.ID != l.ID
                    );
                    leagueFiltered.push(l);
                    this._league.next(leagueFiltered);
                    // console.log(players);
                    // console.log(leagueFiltered);
                    // player.DraftRoster.forEach((y) => {
                    //   const p = x.find(
                    //     (z) => z.player_id.toString() === y.Athlete.AthleteID
                    //   );
                    //   if (p) {
                    //     y.Athlete = GeneralService.FastAPILeagueAthleteModelConverter(p);
                    //   }
                    // });
                  },
                });
            });
          /////////////////////////////////////////////////////////////////////////////
        });
      });
    });
  }

  createLeague(league: LeagueModel): void {
    const settingsMap = new Map<
      SportEnum,
      | FootballLeagueSettingsDLModel
      | BaseballLeagueSettingsDLModel
      | BasketballLeagueSettingsDLModel
      | SoccerLeagueSettingsDLModel
    >([
      [
        SportEnum.Football,
        this.leagueSettingsDLService.FootballSettingsBLtoDL(
          league.Settings as FootballLeagueSettingsModel
        ),
      ],
      [
        SportEnum.Baseball,
        this.leagueSettingsDLService.BaseballSettingsBLtoDL(
          league.Settings as BaseballLeagueSettingsModel
        ),
      ],
      [
        SportEnum.Basketball,
        this.leagueSettingsDLService.BasketballSettingsBLtoDL(
          league.Settings as BasketballLeagueSettingsModel
        ),
      ],
      [
        SportEnum.Soccer,
        this.leagueSettingsDLService.SoccerSettingsBLtoDL(
          league.Settings as SoccerLeagueSettingsModel
        ),
      ],
    ]);
    const leagueDL: LeagueDLModel = new LeagueDLModel();
    leagueDL.ID = league.ID;
    leagueDL.DraftDate = league.DraftDate;
    leagueDL.DraftComplete = false;
    leagueDL.LeagueType = league.LeagueType;
    leagueDL.ManagerID = league.Manager.ID;
    leagueDL.Name = league.Name;
    leagueDL.PlayerIDs = league.Players.map((x) => x.ID);
    leagueDL.Settings =
      settingsMap.get(league.LeagueType) ?? new FootballLeagueSettingsDLModel();
    this.addWithNestedOBJ(leagueDL, CollectionsEnum.League, false);
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    this.leagueSeasonDLService.updateSeason(leagueType, week);
  }

  addSeason(leaugeSeason: Array<LeagueWeekModel>): void {
    this.leagueSeasonDLService.createSeason(leaugeSeason);
  }

  updateTeam(
    leagueID: string,
    teamID: string,
    team: Array<LeagueRosterAthleteModel>
  ): void {
    const league: LeagueModel =
      this._league.value.find((x) => x.ID == leagueID) ?? new LeagueModel();
    const leagueType = league.LeagueType;
    league.Season.forEach((week) => {
      if (
        week.Status == WeekStatusEnum.Current ||
        week.Status == WeekStatusEnum.Future
      ) {
        this.leagueSeasonDLService.updateTeam(leagueType, week, teamID, team);
      }
    });
    this.leagueSeasonDLService.updateWholeSeason(leagueType, league.Season);
  }

  getLeagueSearch(leagueType: SportEnum): Observable<Array<LeagueDLModel>> {
    return this.get(CollectionsEnum.League).pipe(
      map((x) => {
        const l: Array<LeagueDLModel> = x.filter(
          (y) => y.LeagueType == leagueType
        );
        return l;
      })
    );
  }
}
