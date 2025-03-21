import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';

import { FootballPositionEnum } from '../../enums/position/football-position.enum';
import { RosterPositionEnum } from '../../enums/roster-position.enum';
import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { CurrentUserModel } from '../../models/current-user.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueScorboardModel } from '../../models/league-scoreboard.model';
import { LeagueSearchModel } from '../../models/league-search.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { LeagueDLService } from '../dl/league-dl.service';
import { LeagueDLModel } from '../dl/models/league-dl.model';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { AthleteService } from './athlete.service';
import { LoadingService } from './loading.service';
import { PlayerService } from './player.service';
import { SchoolService } from './school.service';
import { UserService } from './user.service';

@Injectable()
export class LeagueService implements OnDestroy {
  league: Observable<Array<LeagueModel>>;

  leagueScoreboard: Observable<Array<LeagueScorboardModel>>;

  leaguesForSearch: Observable<Array<LeagueSearchModel>>;

  private currentUser: CurrentUserModel = new CurrentUserModel();

  // private _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leaguesForSearch = new BehaviorSubject<Array<LeagueSearchModel>>([]);

  private _leagueScoreboard = new BehaviorSubject<Array<LeagueScorboardModel>>(
    []
  );

  private unsubscribe = new Subject<void>();

  constructor(
    private schoolService: SchoolService,
    private leagueDLService: LeagueDLService,
    private athleteService: AthleteService,
    private loadingService: LoadingService,
    private fastAPIService: FastAPIService,
    private userService: UserService,
    private playerService: PlayerService
  ) {
    this.league = this.leagueDLService.league; // need to figure out if this is needed
    this.league.pipe(take(1)).subscribe({
      // need to figure out if this is needed
      next: (l) => this.leagueDLService._league.next(l),
    });
    // this.league = this._league.asObservable(); // need to figure out if this is needed
    this.leagueScoreboard = this._leagueScoreboard.asObservable();
    this.leaguesForSearch = this._leaguesForSearch.asObservable();

    this.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (league) => {
        this.initializeLeagueScoreBoards();
      },
    });

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.initializeLeagueScoreBoards();
      },
    });
    // this.initializeLeagueScoreBoards();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  generateID(): string {
    return this.leagueDLService.getNewID();
  }

  convertLeagues(
    leagueIDs: Array<string>,
    athletes: Array<LeagueAthleteModel>,
    schools: Array<SchoolModel>
  ): void {
    // this.leagueDLService.convertLeagues(athletes, schools);
    this.leagueDLService.convertLeagues2(leagueIDs, athletes, schools);
    this.initializeLeagueScoreBoards();
  }

  initializeLeagueScoreBoards(): void {
    const scoreboards: Array<LeagueScorboardModel> = [];
    this.loadingService.setIsLoading(true);
    this.fastAPIService
      .getAllSchools()
      .pipe(take(1))
      .subscribe({
        next: (schools) => {
          this.leagueDLService._league.value?.forEach((league) => {
            const newScoreboard: LeagueScorboardModel =
              new LeagueScorboardModel();

            (newScoreboard.CurrentRanking = 2),
              (newScoreboard.ID = league.ID),
              (newScoreboard.Leader = 'John Smith'),
              (newScoreboard.Manager = 'John Smith'),
              (newScoreboard.Name = league.Name),
              (newScoreboard.PrimaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.PrimaryColor),
              (newScoreboard.SecondaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.SecondaryColor),
              (newScoreboard.Sport = SportEnum.Football),
              (newScoreboard.Team =
                league.Players.find((x) => x.PlayerID === this.currentUser.ID)
                  ?.TeamName ?? '');

            // newScoreboard.Manager = league.Manager.Name;
            // newScoreboard.Name = league.Name;
            // newScoreboard.Sport = league.LeagueType;
            // newScoreboard.Team =
            //   league.Players.find((p) => p.PlayerID === this.currentUser.ID)
            //     ?.Name ?? '';
            scoreboards.push(newScoreboard);
          });

          const seenScoreboard = new Set();
          const scoreBoardsFiltered: Array<LeagueScorboardModel> =
            scoreboards.filter((scoreboard) => {
              if (seenScoreboard.has(scoreboard.ID)) {
                return false;
              } else {
                seenScoreboard.add(scoreboard.ID);
                return true;
              }
            });

          this._leagueScoreboard.next(scoreBoardsFiltered);
          this.loadingService.setIsLoading(false);
        },
      });
  }

  addPlayerToLeague(leagueID: string, player: LeaguePlayerModel): void {
    this.leagueDLService.addPlayerToLeague(leagueID, player.ID);
    this.playerService.addPlayer(player);
  }

  getLeagueTeam(
    leagueID: string,
    teamID: string
  ): Array<LeagueRosterAthleteModel> | undefined {
    this.loadingService.setIsLoading(true);
    const league = this.getLeague(leagueID);
    if (league) {
      const currentWeek = league.Season.find(
        (week) => week.Status == WeekStatusEnum.Current
      );
      const player = league.Players.find((x) => x.ID === teamID);
      if (currentWeek) {
        const game = currentWeek.Games.find(
          (games) =>
            games.AwayTeamPlayerID === teamID ||
            games.HomeTeamPlayerID === teamID
        );
        if (game && game.AwayTeamPlayerID == teamID) {
          this.loadingService.setIsLoading(false);
          return game.AwayTeam;
        } else if (game && game.HomeTeamPlayerID == teamID) {
          this.loadingService.setIsLoading(false);
          return game.HomeTeam;
        }
      }
      // const player = league.Players.find((x) => x.ID === teamID);
      // if (player) {
      //   const athletes: Array<LeagueAthleteModel> =
      //     this.athleteService.getTeam(player);
      // this.loadingService.setIsLoading(false);
      // return { player, athletes };
      // }
    }
    this.loadingService.setIsLoading(false);
    return undefined;
  }

  getLeagueType(leagueID: string): SportEnum | undefined {
    const league = this.getLeague(leagueID);
    return league?.LeagueType;
  }

  getLeague(leagueID: string): LeagueModel | undefined {
    const league = this.leagueDLService._league.value.find(
      (x) => x.ID === leagueID
    );
    return league;
  }

  getLeaguesForSearch(lt: SportEnum): void {
    let l: Array<LeagueDLModel> = [];
    this.leagueDLService
      .getLeagueSearch(lt)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (league) => {
          l = league;
          const leagueUnfiltered = l.map((obj): LeagueSearchModel => {
            return {
              ID: obj.ID,
              Manager: new LeaguePlayerModel(),
              Name: obj.Name,
              DraftDate: obj.DraftDate,
              LeagueType: obj.LeagueType,
              CurrentPlayers: obj.PlayerIDs.length,
              MaxPlayers: obj.Settings.GSM.NOT,
              Settings: obj.Settings,
            };
          });
          const leagues = leagueUnfiltered.filter(
            (x) => x.LeagueType === Number(lt)
          );
          this._leaguesForSearch.next(leagues);
        },
      });
  }

  addAthleteToTeamFromDraft(
    leagueID: string,
    playerID: string,
    athlete: LeagueAthleteModel
  ): void {
    const league: LeagueModel | undefined = this.getLeague(leagueID);
    if (league) {
      const player = league.Players.find((x) => x.PlayerID === playerID);
      const teamID = player?.ID ?? '';
      if (player) {
        player.DraftTeamPlayerIDs.push(athlete.AthleteID);

        player.DraftRoster.push(
          this.updateNewRoster(league.LeagueType, player.DraftRoster, athlete)
        );
        // player.DraftRoster = this.updateRoster(
        //   league.LeagueType,
        //   player.DraftRoster,
        //   athlete
        // );

        const week = league.Season.find((week) => week.Week == 1);
        if (week) {
          const game = week.Games.find(
            (g) => g.AwayTeamPlayerID == teamID || g.HomeTeamPlayerID == teamID
          );
          if (game && game.AwayTeamPlayerID == teamID) {
            if (!game.AwayTeam) {
              game.AwayTeam = [];
            }
            const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
              league.LeagueType,
              game.AwayTeam,
              athlete
            );
            game.AwayTeam.push(newPlayer);
            // game.AwayTeam = this.updateRoster(
            //   league.LeagueType,
            //   game.AwayTeam,
            //   athlete
            // );
          } else if (game && game.HomeTeamPlayerID == teamID) {
            // game.HomeTeam = this.updateRoster(
            //   league.LeagueType,
            //   game.HomeTeam,
            //   athlete
            // );

            if (!game.HomeTeam) {
              game.HomeTeam = [];
            }
            const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
              league.LeagueType,
              game.HomeTeam,
              athlete
            );
            game.HomeTeam.push(newPlayer);
          }
          if (game) {
            this.updateSeason(league.LeagueType, week);
          }
        }
      }
      this.updateLeague(league);
    }
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    this.leagueDLService.updateSeason(leagueType, week);
  }

  updateTeam(
    leagueID: string,
    teamID: string,
    team: Array<LeagueRosterAthleteModel>
  ): void {
    this.leagueDLService.updateTeam(leagueID, teamID, team);
  }

  updateLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    const leaguesFiltered = leagues.filter((x) => x.ID !== league.ID);
    leaguesFiltered.push(league);
    this.leagueDLService._league.next(leaguesFiltered);
    this.getLeaguesForSearch(league.LeagueType);
  }

  addLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    leagues.push(league);
    league.Season.forEach((x) => (x.LeagueID = league.ID));
    this.leagueDLService.addSeason(league.Season);
    this.leagueDLService.createLeague(league);
    this.leagueDLService._league.next(leagues);
    this.initializeLeagueScoreBoards();
  }

  CheckAthleteOnTeam(
    leagueID: string,
    athleteID: string
  ): LeaguePlayerModel | undefined {
    const league: LeagueModel =
      this.leagueDLService._league.value.find((x) => x.ID == leagueID) ??
      new LeagueModel();
    let retVal: LeaguePlayerModel = new LeaguePlayerModel();
    league.Season[0]?.Games.forEach((game) => {
      if (game.AwayTeam.find((x) => x.Athlete.AthleteID == athleteID)) {
        retVal =
          league.Players.find((x) => x.ID == game.AwayTeamPlayerID) ??
          new LeaguePlayerModel();
      } else if (game.HomeTeam.find((x) => x.Athlete.AthleteID == athleteID)) {
        retVal =
          league.Players.find((x) => x.ID == game.HomeTeamPlayerID) ??
          new LeaguePlayerModel();
      }
    });

    if (retVal.ID.length > 0) {
      return retVal;
    } else {
      return undefined;
    }
  }

  // updatePlayerIDs(
  //   athletes: Array<LeagueAthleteModel>,
  //   league: LeagueModel
  // ): Array<LeagueAthleteModel> {
  //   const retVal: Array<LeagueAthleteModel> = [];
  //   const leagueAthletes: Array<LeagueAthleteModel> = [];

  //   leagueAthletes.forEach((athlete) => {
  //     athletes = athletes.filter((x) => x.AthleteID != athlete.AthleteID);
  //     retVal.push(athlete);
  //   });
  //   return retVal.concat(athletes);
  // }

  //#region test roster
  private updateNewRoster(
    leagueType: SportEnum,
    teamRoster: Array<LeagueRosterAthleteModel>,
    athlete: LeagueAthleteModel
  ): LeagueRosterAthleteModel {
    const rosterAthlete: LeagueRosterAthleteModel =
      new LeagueRosterAthleteModel();
    rosterAthlete.Athlete = athlete;
    rosterAthlete.RosterPosition = RosterPositionEnum.FirstString;
    switch (leagueType) {
      case SportEnum.Baseball:
        break;
      case SportEnum.Basketball:
        break;
      case SportEnum.Football:
        switch (athlete.Position) {
          case FootballPositionEnum.QB:
            const qbFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.QB &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!qbFS) {
              return rosterAthlete;
            } else {
              const qbSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.QB &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!qbSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case FootballPositionEnum.WR:
            const wrFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.WR &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!wrFS1) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const wrFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.WR &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!wrFS2) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const wrSS1 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == FootballPositionEnum.WR &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!wrSS1) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const wrSS2 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == FootballPositionEnum.WR &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!wrSS2) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = true;
                    return rosterAthlete;
                  } else {
                    return this.setBenchPosition(athlete, teamRoster);
                  }
                }
              }
            }
          case FootballPositionEnum.RB:
            const rbFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.RB &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!rbFS1) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const rbFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.RB &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!rbFS2) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const rbSS1 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == FootballPositionEnum.RB &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!rbSS1) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const rbSS2 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == FootballPositionEnum.RB &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!rbSS2) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = true;
                    return rosterAthlete;
                  } else {
                    return this.setBenchPosition(athlete, teamRoster);
                  }
                }
              }
            }
          case FootballPositionEnum.TE:
            const teFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.TE &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!teFS) {
              return rosterAthlete;
            } else {
              const teSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.TE &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!teSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case FootballPositionEnum.P:
            const pFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.P &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!pFS) {
              return rosterAthlete;
            } else {
              const pSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.P &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!pSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
        }
        break;
      case SportEnum.Soccer:
        break;
    }
    return rosterAthlete; //Should be able to remove once other sport types are added. Need to work out solution for too many of a player selected
  }

  private setBenchPosition(
    athlete: LeagueAthleteModel,
    teamRoster: Array<LeagueRosterAthleteModel>
  ): LeagueRosterAthleteModel {
    const rosterAthlete: LeagueRosterAthleteModel =
      new LeagueRosterAthleteModel();
    rosterAthlete.Athlete = athlete;
    const b1 = teamRoster.find(
      (x) => x.RosterPosition == RosterPositionEnum.B1
    );
    if (!b1) {
      rosterAthlete.RosterPosition = RosterPositionEnum.B1;
    } else {
      const b2 = teamRoster.find(
        (x) => x.RosterPosition == RosterPositionEnum.B2
      );
      if (!b2) {
        rosterAthlete.RosterPosition = RosterPositionEnum.B2;
      } else {
        const b3 = teamRoster.find(
          (x) => x.RosterPosition == RosterPositionEnum.B3
        );
        if (!b3) {
          rosterAthlete.RosterPosition = RosterPositionEnum.B3;
        } else {
          const b4 = teamRoster.find(
            (x) => x.RosterPosition == RosterPositionEnum.B4
          );
          if (!b4) {
            rosterAthlete.RosterPosition = RosterPositionEnum.B4;
          } else {
            const b5 = teamRoster.find(
              (x) => x.RosterPosition == RosterPositionEnum.B5
            );
            if (!b5) {
              rosterAthlete.RosterPosition = RosterPositionEnum.B5;
            } else {
              const b6 = teamRoster.find(
                (x) => x.RosterPosition == RosterPositionEnum.B6
              );
              if (!b6) {
                rosterAthlete.RosterPosition = RosterPositionEnum.B6;
              }
            }
          }
        }
      }
    }

    return rosterAthlete;
  }
  //#endregion
}
